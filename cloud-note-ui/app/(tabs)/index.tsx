import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useAuthenticator } from '@aws-amplify/ui-react-native'
import { useEffect } from 'react';
import { Auth } from 'aws-amplify';

export default function TabOneScreen() {
  const {signOut} = useAuthenticator()

  const ping = () => {
    fetch("https://qtyr507q2m.execute-api.us-west-1.amazonaws.com/v1/get")
      .then((res) => {
        console.log(res)
        return res.json()
      }) 
      .then((data) => console.log(data))
  }

  const getToken = async () => {
    return (await Auth.currentSession()).getIdToken().getJwtToken()
  }

  useEffect(() => {
    console.log(getToken())
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button title="Sign Out" onPress={signOut} />
      <Button title="Ping" onPress={ping} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
