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
import { IMetas, IProduct, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
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
  const productDocRef = doc(productCollectionRef); // gera ID automático
  const productId = productDocRef.id;

  const productDataWithId = {
    ...data,
    id_product: productId,
    uid: user.uid
  };

  return from(setDoc(productDocRef, productDataWithId, { merge: true })).pipe(
    catchError(error => throwError(() => new Error(`Erro ao salvar produto: ${error.message}`)))
  );
  }

  setMetas(data: IMetas): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const metasCollectionRef = collection(this.firestore, 'goals');
    const metasDocRef = doc(metasCollectionRef);
    return from(setDoc(metasDocRef, { ...data, uid: user.uid }, { merge: true })).pipe(
      catchError(error => throwError(() => new Error(`Erro ao salvar metas: ${error.message}`)))
    );
  }
  updateMeta(data: any): Observable<any> {
  const user = this.auth.currentUser;
  if (!user) {
    return throwError(() => new Error('Usuário não autenticado.'));
  }

  if (!data.id) {
    return throwError(() => new Error('ID da meta não informado.'));
  }

  const metasDocRef = doc(this.firestore, 'goals', data.id);

  return from(
    setDoc(metasDocRef, { ...data, uid: user.uid }, { merge: true })
  ).pipe(
    catchError(error => throwError(() => new Error(`Erro ao salvar metas: ${error.message}`)))
  );
}


  getVendasByUser(idProduct: string): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    const vendasCollection = collection(this.firestore, 'sales');
    const q = query(
      vendasCollection,
      where('uid', '==', user.uid),
      where('id_product', '==', idProduct)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      catchError(err => throwError(() => new Error(`Erro ao buscar vendas: ${err.message}`)))
    );
  }

  getMetasByUser(idProduct: string): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    const metasCollection = collection(this.firestore, 'goals');
    const q = query(
      metasCollection,
      where('uid', '==', user.uid),
      where('id_product', '==', idProduct)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))),
      catchError(err => throwError(() => new Error(`Erro ao buscar metas: ${err.message}`)))
    );
  }
  setNotification(data: any): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }
    const notificationCollectionRef = collection(this.firestore, 'notification');
    const notificationDocRef = doc(notificationCollectionRef);
    const notificationId = notificationDocRef.id;
    const notificationDataWithId = {
      ...data,
      id: notificationId,
      uid: user.uid
    };

    return from(setDoc(notificationDocRef, notificationDataWithId, { merge: true })).pipe(
      catchError(error => throwError(() => new Error(`Erro ao salvar notificação: ${error.message}`)))
    );
  }

}