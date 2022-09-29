import { FlatList, SafeAreaView, StatusBar, StyleSheet, View } from "react-native"
import NotaEditor from "./src/componentes/NotaEditor"

/*import AsyncStorage from '@react-native-async-storage/async-storage';*/
import { useEffect, useState } from "react";
import { Nota } from "./src/componentes/Nota";
import { buscaNotas, criaTabela, filtraPorCategoria  } from "./src/servicos/Notas";

import { Picker } from "@react-native-picker/picker"

export default function App() {

  // Função que cria tabela no SQLite assim que a aplicação roda
  useEffect(() => {
    criaTabela()
    mostraNotas()
  }, [])

  /* Hook useState => para salvar em 'notas' um array de notas, para assim alterar o estado do nosso
   componente NotaEditor na tela */
  const [notas, setNotas] = useState([]) 
  // Função assincrona para leitura de uma nota
  async function mostraNotas() {
    /*const todasChaves = await AsyncStorage.getAllKeys() //Pega os IDs das notas
    const todasNotas = await AsyncStorage.multiGet(todasChaves) //Pega todas as notas pelos IDs*/

    const todasNotas = await buscaNotas()
    setNotas(todasNotas)
  }

  //Obter informação de qual nota em contexto é, para poder alterá-la
  const [notaSelecionada, setNotaSelecionada] = useState({})

  const [categoria, setCategoria] = useState("Todos")

  async function filtraLista(categoriaSelecionada) {
    setCategoria(categoriaSelecionada)
    if(categoriaSelecionada == "Todos") {
      mostraNotas()
    } else {
      setNotas(await filtraPorCategoria(categoriaSelecionada))
    }
  }

  return (
    <SafeAreaView style={estilos.container}>
      <FlatList
        data={notas}
        renderItem={(nota) => <Nota {...nota} setNotaSelecionada={setNotaSelecionada}/>} /* Para cada nota, renderiza o componente de Nota.js, passando as informações da nota */
        keyExtractor={nota => nota.id} /* Chave unica para cada um dos itens renderizados na flatlist */
        ListHeaderComponent={() => {return (
          <View style={estilos.picker}>
            <Picker selectedValue={categoria} onValueChange={(categoriaSelecionada) => filtraLista(categoriaSelecionada)}>
              <Picker.Item label="Todos" value="Todos"/>
              <Picker.Item label="Pessoal" value="Pessoal"/>
              <Picker.Item label="Trabalho" value="Trabalho"/>
              <Picker.Item label="Outros" value="Outros"/>
            </Picker>
          </View>
        )}}
      />
      <NotaEditor 
        mostraNotas={mostraNotas} 
        notaSelecionada={notaSelecionada}
        setNotaSelecionada={setNotaSelecionada}/>
      <StatusBar/>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch",
		justifyContent: "flex-start",
	},
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#EEEEEE",
    margin: 16,
  }
})

