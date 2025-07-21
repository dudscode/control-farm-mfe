import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { catchError, combineLatest, from, map, Observable, of, switchMap, throwError } from 'rxjs';


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
  getProductAndVendas(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    const productsQuery = query(
      collection(this.firestore, 'product'),
      where('uid', '==', user.uid)
    );

    return from(getDocs(productsQuery)).pipe(
      switchMap(snapshot => {
        const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        if (produtos.length === 0) {
          return of([]);
        }

        const produtosComVendas$ = produtos.map(produto => {
          const vendasQuery = query(
            collection(this.firestore, 'sales'),
            where('uid', '==', user.uid),
            where('id_product', '==', produto.id)
          );

          return from(getDocs(vendasQuery)).pipe(
            map(vendasSnap => {
              const vendas = vendasSnap.docs.map(v => ({ id: v.id, ...v.data() }));
              return {
                ...produto,
                vendas
              };
            })
          );
        });

        return combineLatest(produtosComVendas$);
      }),
      catchError(err => throwError(() => new Error(`Erro ao buscar produtos: ${err.message}`)))
    );
  }
  getVendasAndProduct(): Observable<any[]> {
  const user = this.auth.currentUser;
  if (!user) {
    return throwError(() => new Error('Usuário não autenticado.'));
  }

  const vendasQuery = query(
    collection(this.firestore, 'sales'),
    where('uid', '==', user.uid)
  );

  return from(getDocs(vendasQuery)).pipe(
    switchMap(snapshot => {
      const vendas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

      if (vendas.length === 0) {
        return of([]);
      }

      const vendasComProduto$ = vendas.map(venda => {
        const produtoRef = doc(this.firestore, 'product', venda.id_product);

        return from(getDoc(produtoRef)).pipe(
          map(produtoSnap => {
            const produto = produtoSnap.exists() ? produtoSnap.data() : null;
            return {
              ...venda,
              produto
            };
          })
        );
      });

      return combineLatest(vendasComProduto$);
    }),
    catchError(err => throwError(() => new Error(`Erro ao buscar vendas: ${err.message}`)))
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
  updateProduct(data: IProduct): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    if (!data.id_product) {
      return throwError(() => new Error('ID do produto é obrigatório para atualizar.'));
    }

    const productDocRef = doc(this.firestore, 'product', data.id_product);

    const updateData = {
      saled: data.saled,
      amount_available: data.amount_available
    };

    return from(updateDoc(productDocRef, updateData)).pipe(
      catchError(error =>
        throwError(() => new Error(`Erro ao atualizar produto: ${error.message}`))
      )
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

  getMetas(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return throwError(() => new Error('Usuário não autenticado.'));
    }

    const metasCollection = collection(this.firestore, 'goals');
    const q = query(metasCollection, where('uid', '==', user.uid));

    return from(getDocs(q)).pipe(
      switchMap(snapshot => {
        const metas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        if (metas.length === 0) {
          return of([]); 
        }

        const metasComProdutos$ = metas.map(meta => {
          const produtoRef = doc(this.firestore, 'product', meta.id_product);
          return from(getDoc(produtoRef)).pipe(
            map(produtoSnap => {
              const produtoData = produtoSnap.exists() ? produtoSnap.data() : null;
              return {
                ...meta,
                produto: produtoData
              };
            })
          );
        });

        return combineLatest(metasComProdutos$); 
      }),
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