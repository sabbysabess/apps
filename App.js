import { useState } from 'react';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, ScrollView,
  ActivityIndicator, Alert, Keyboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const statusBarHeight = StatusBar.currentHeight;
const KEY_GPT = 'sk-proj-9JjboNGiLqEIWQC5aU2lT3BlbkFJeGLjDrOOn7gI5bMMrsxC';

export default function App() {

  const [genero, setGenero] = useState("");
  const [idade, setIdade] = useState(10);
  const [loading, setLoading] = useState(false);
  const [jogo, setJogo] = useState("")

  async function handleGenerate() {
    if (genero === "") {
      Alert.alert("Atenção", "Preencha o nome da cidade!")
      return;
    }

    setJogo("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Faça uma recomendação de jogo de para pessoas de até ${idade.toFixed(0)} anos e de gênero ${genero}, forneça a classificação indicativa, o gênero do jogo, e um resumo de sua história e jogabilidade.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setJogo(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>Recomendação de jogos</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Gênero de jogo preferido</Text>
        <TextInput
          placeholder="Ex: aventura"
          style={styles.input}
          value={genero}
          onChangeText={(text) => setGenero(text)}
        />

        <Text style={styles.label}>Faixa etária: <Text style={styles.idade}> {idade.toFixed(0)} </Text> anos</Text>
        <Slider
          minimumValue={10}
          maximumValue={18}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={idade}
          onValueChange={(value) => setIdade(value)}
        />
      </View>

      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Gerar roteiro</Text>
        <MaterialIcons name="stadia_controller" size={24} color="#FFF" />
      </Pressable>

      <ScrollView contentContainerStyle={{ paddingBottom: 24, marginTop: 4, }} style={styles.containerScroll} showsVerticalScrollIndicator={false} >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.title}>Carregando roteiro...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {jogo && (
          <View style={styles.content}>
            <Text style={styles.title}>Roteiro da viagem 👇</Text>
            <Text style={{ lineHeight: 24, }}>{jogo}</Text>
          </View>
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  idade: {
    backgroundColor: '#F1f1f1'
  },
  button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});