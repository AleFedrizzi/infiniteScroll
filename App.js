import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

import axios from 'axios';

export default function App() {

  //O endereço da API
  const baseURL = 'https://api.github.com';
  //Quantidade de endereços por páginas
  const perPage = 20;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadApi();
  },[]);

  //verifica se está em load 
  async function loadApi(){
    if(loading) return;

    setLoading(true);

    //fazer a nossa requisição a api 
    const response = await axios.get(`${baseURL}/search/repositories?q=react&per_page=${perPage}&page=${page}`)

    setData([...data, ...response.data.items])
    setPage(page + 1);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList 
      style={{ marginTop: 55}}
      contentContainerStyle={{ marginHorizontal: 20}}
      data={data}
      keyExtractor={ item => String(item.id)}
      renderItem={ ({ item }) => <ListItem data={item} />}
      // Para carregar mais 20
      onEndReached={loadApi}
      onEndReachedThreshold={0.1}
      // para chamar um loading na mudança da peagina
      ListFooterComponent={ <FooterList load={loading} /> }
      />
    </View>
  );
} 

function ListItem ({ data }){
  return(
    <View style={styles.listItem}>
      <Text style={styles.listText}>{data.full_name}</Text>
    </View>
  )
}

function FooterList({ load }){
  if(!load) return null;

  return(
    <View style={styles.loading}>
      <ActivityIndicator size={25} color='#121212'/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem:{
    backgroundColor: '#121212',
    padding: 25,
    marginTop: 20,
    borderRadius: 10
  },
  listText:{
    fontSize: 16,
    color: '#FFF',
  },
  loading:{
    padding: 10,
  }
});
