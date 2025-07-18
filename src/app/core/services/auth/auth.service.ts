import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';


import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { IProduct, IProductName, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  user$: Observable<User | null> = authState(this.auth);
  userDados = signal<any>({});


  getUserProfile(): Observable<any> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) throw new Error('Usuário não autenticado.');
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return from(getDoc(userDocRef)).pipe(
          map(docSnap => {
            if (docSnap.exists()) {
              this.userDados.set({ id: docSnap.id, ...docSnap.data() });
              return { id: docSnap.id, ...docSnap.data() };
            } else {
              return null;
            }
          })
        );
      })
    );
  }
  getProducts(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const q = query(
      collection(this.firestore, 'product'),
      where('uid', '==', user.uid)
    );

    return from(
      getDocs(q).then(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    );
  }
  getProductNames(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const productCollection = collection(this.firestore, 'product-name');
    const q = query(productCollection);

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      catchError(err => throwError(() => new Error(`Erro ao buscar produtos: ${err.message}`)))
    );
  }

  setSales(data: IVendaCadastro): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const salesCollectionRef = collection(this.firestore, 'sales');
    const salesDocRef = doc(salesCollectionRef);
    return from(setDoc(salesDocRef, { ...data, uid: user.uid }, { merge: true })).pipe(
      catchError(error => throwError(() => new Error(`Erro ao salvar venda: ${error.message}`)))
    );
  }
  setProduct(data: IProduct): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const productCollectionRef = collection(this.firestore, 'product');
    const productDocRef = doc(productCollectionRef);
    return from(setDoc(productDocRef, { ...data, uid: user.uid }, { merge: true })).pipe(
      catchError(error => throwError(() => new Error(`Erro ao salvar produto: ${error.message}`)))
    );
  }


}

