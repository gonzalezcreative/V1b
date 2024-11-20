import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  collection, 
  query, 
  onSnapshot,
  where,
  or,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

// ... rest of your imports ...

export function LeadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(leadReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe = () => {};

    const setupLeadsSubscription = async () => {
      try {
        let q;
        
        if (user) {
          if (user.role === 'admin') {
            // Admin sees all leads
            q = query(
              collection(db, 'leads'),
              orderBy('createdAt', 'desc')
            );
          } else {
            // Regular users see new leads and their purchased leads
            q = query(
              collection(db, 'leads'),
              or(
                where('status', '==', 'New'),
                where('purchasedBy', '==', user.id)
              ),
              orderBy('createdAt', 'desc')
            );
          }
        } else {
          // Non-authenticated users only see new leads
          q = query(
            collection(db, 'leads'),
            where('status', '==', 'New'),
            orderBy('createdAt', 'desc')
          );
        }

        unsubscribe = onSnapshot(q, (snapshot) => {
          const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Lead[];
          
          dispatch({ type: 'SET_LEADS', payload: leads });
        }, (error) => {
          console.error('Error fetching leads:', error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
        });
      } catch (error) {
        console.error('Error setting up leads subscription:', error);
      }
    };

    setupLeadsSubscription();
    return () => unsubscribe();
  }, [user]);

  // ... rest of your component code ...
}