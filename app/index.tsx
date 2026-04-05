import { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Carro = {
  modelo: string;
  valor: string;
  ano: string;
};

export default function Index(){

  const [modelo, setModelo] = useState('');
  const [valor, setValor] = useState('');
  const [ano, setAno] = useState('');
  const [carros, setCarros] = useState<Carro[]>([]);
  const [busca, setBusca] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  
  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    const dados = await AsyncStorage.getItem('carros');
    if (dados) setCarros(JSON.parse(dados));
  };

  const salvar = async (lista: Carro[]) => {
    setCarros(lista);
    await AsyncStorage.setItem('carros', JSON.stringify(lista));
  };

  const adicionar = () => {
    if (!modelo || !valor || !ano) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (isNaN(Number(valor))) {
      Alert.alert('Erro', 'Valor inválido');
      return;
    }

    const novo = { modelo, valor, ano };

    let novaLista;

    if (editIndex !== null) {
      novaLista = carros.map((c, i) => i === editIndex ? novo : c);
      setEditIndex(null);
    } else {
      novaLista = [...carros, novo];
    }

    salvar(novaLista);

    setModelo('');
    setValor('');
    setAno('');
  };


  const remover = (index: number) => {
    const novaLista = carros.filter((_, i) => i !== index);
    salvar(novaLista);
  };

  
  const editar = (index: number) => {
    const c = carros[index];
    setModelo(c.modelo);
    setValor(c.valor);
    setAno(c.ano);
    setEditIndex(index);
  };

  
  const filtrados = carros.filter(c =>
    c.modelo.toLowerCase().includes(busca.toLowerCase())
  );

  return(
    <View style={styles.tudo}>

      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.titulo}>Gerenciador de Carros</Text>

      <TextInput
        style={styles.caixaDeTexto}
        placeholder='Buscar carro'
        placeholderTextColor='#6f6f6f'
        value={busca}
        onChangeText={setBusca}
      />

      <TextInput
        style={styles.caixaDeTexto}
        placeholder='Modelo'
        placeholderTextColor='#6f6f6f'
        value={modelo}
        onChangeText={setModelo}
      />

      <TextInput
        style={styles.caixaDeTexto}
        placeholder='Valor'
        placeholderTextColor='#6f6f6f'
        keyboardType='numeric'
        value={valor}
        onChangeText={setValor}
      />

      <TextInput
        style={styles.caixaDeTexto}
        placeholder='Ano'
        placeholderTextColor='#6f6f6f'
        keyboardType='numeric'
        value={ano}
        onChangeText={setAno}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionar}>
        <Text style={styles.textoBotao}>
          {editIndex !== null ? 'Salvar edição' : 'Adicionar'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ width: '100%' }}>
        {filtrados.map((carro, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTexto}>Modelo: {carro.modelo}</Text>
            <Text style={styles.cardTexto}>Valor: {carro.valor}</Text>
            <Text style={styles.cardTexto}>Ano: {carro.ano}</Text>

            <View style={styles.acoes}>
              <TouchableOpacity onPress={() => editar(index)}>
                <Text style={styles.editar}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => remover(index)}>
                <Text style={styles.remover}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  tudo:{
    flex:1,
    backgroundColor:'#000',
    alignItems:'center',
    paddingTop:40
  },

  titulo:{
    color:'#0081f1',
    fontSize:28,
    marginBottom:15
  },

  caixaDeTexto:{
    width:'85%',
    borderWidth:1,
    borderColor:'#0081f1',
    color:'#fff',
    borderRadius:40,
    paddingLeft:20,
    height:50,
    marginBottom:10
  },

  botao:{
    backgroundColor:'#0081f1',
    width:'85%',
    padding:15,
    borderRadius:25,
    alignItems:'center',
    marginTop:10,
    marginBottom:20
  },

  textoBotao:{
    color:'#fff',
    fontSize:18
  },

  card:{
    backgroundColor:'#111',
    borderRadius:15,
    padding:15,
    marginBottom:10,
    width:'90%',
    alignSelf:'center',
    borderColor:'#0081f1',
    borderWidth:1
  },

  cardTexto:{
    color:'#fff',
    fontSize:16
  },

  acoes:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:10
  },

  editar:{
    color:'#00ff88'
  },

  remover:{
    color:'red'
  }

});