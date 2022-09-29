import { db } from './SQLite';

//CREATE TABLE
export function criaTabela() {
    db.transaction((transaction) => {
        transaction.executeSql("CREATE TABLE IF NOT EXISTS " +
            "Notas " + 
            "(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, categoria TEXT, texto TEXT);")
    })
}

//CREATE NOTA
export async function adicionaNota(nota) {
    /* Como o transaction não devolve uma promise, nem permite uma função assincrona 
    Cria-se uma Promise com uma função de callbak -> (resolve) que será chamada assim que o transaction finalizar
    que retorna positivamente se tudo correu bem com a execução */

    return new Promise((resolve) => {
        db.transaction((transaction) => {
            transaction.executeSql("INSERT INTO Notas (titulo, categoria, texto) VALUES (?, ?, ?);", [nota.titulo, nota.categoria, nota.texto], () => {
                resolve("Nota adicionada com sucesso!")
            })
        })
    })
}

//READ NOTA
export async function buscaNotas() {
    /* Como o transaction não devolve uma promise, nem permite uma função assincrona 
    Cria-se uma Promise com uma função de callbak -> (resolve) que será chamada assim que o transaction finalizar
    que retorna positivamente se tudo correu bem com a execução */

    return new Promise((resolve) => {
        db.transaction((transaction) => {                 /* É preciso passar o transaction, para poder passar um
                                                             segundo parametro para receber o resultado do SELECT */
            transaction.executeSql("SELECT * FROM Notas;", [], (transaction, resultados) => {
                resolve(resultados.rows._array)
            })
        })
    })
}

//UPDATE NOTA
export async function atualizaNota(nota) {
    /* Como o transaction não devolve uma promise, nem permite uma função assincrona 
    Cria-se uma Promise com uma função de callbak -> (resolve) que será chamada assim que o transaction finalizar
    que retorna positivamente se tudo correu bem com a execução */

    return new Promise((resolve) => {
        db.transaction((transaction) => {
            transaction.executeSql("UPDATE Notas SET titulo = ?, categoria = ?, texto = ? WHERE id = ?;", [nota.titulo, nota.categoria, nota.texto, nota.id], () => {
                resolve("Nota alterada com sucesso!")
            })
        })
    })
}

//DELETE NOTA
export async function removeNota(nota) {
    /* Como o transaction não devolve uma promise, nem permite uma função assincrona 
    Cria-se uma Promise com uma função de callbak -> (resolve) que será chamada assim que o transaction finalizar
    que retorna positivamente se tudo correu bem com a execução */

    return new Promise((resolve) => {
        db.transaction((transaction) => {
            transaction.executeSql("DELETE FROM Notas WHERE id = ?;", [nota.id], () => {
                resolve("Nota deletada com sucesso!")
            })
        })
    })
}

export async function filtraPorCategoria(categoria) {
    return new Promise((resolve) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM Notas WHERE categoria = ?;", [categoria], (tx, results) => {
                resolve(results.rows._array)
            })
        })
    })
  }
