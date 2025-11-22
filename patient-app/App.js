import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Lista de emoções para seleção
const EMOTIONS = [
  { name: 'Alegria', color: '#4CAF50' },
  { name: 'Tristeza', color: '#2196F3' },
  { name: 'Ansiedade', color: '#FF9800' },
  { name: 'Raiva', color: '#F44336' },
  { name: 'Calma', color: '#00BCD4' },
  { name: 'Frustração', color: '#9C27B0' },
];

// Componente para a seleção de emoções
const EmotionPicker = ({ selectedEmotions, onSelectEmotion }) => (
  <View style={styles.emotionContainer}>
    {EMOTIONS.map((emotion) => (
      <TouchableOpacity
        key={emotion.name}
        style={[
          styles.emotionButton,
          { backgroundColor: selectedEmotions.includes(emotion.name) ? emotion.color : '#E0E0E0' },
        ]}
        onPress={() => onSelectEmotion(emotion.name)}
      >
        <Text style={[styles.emotionText, { color: selectedEmotions.includes(emotion.name) ? '#FFFFFF' : '#000000' }]}>
          {emotion.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function App() {
  const [humor, setHumor] = useState('5');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [evento, setEvento] = useState('');
  const [pensamentos, setPensamentos] = useState('');
  const [comportamento, setComportamento] = useState('');

  const handleSelectEmotion = (emotionName) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotionName)) {
        return prev.filter((name) => name !== emotionName);
      } else if (prev.length < 3) {
        return [...prev, emotionName];
      }
      return prev; // Limita a 3 emoções
    });
  };

  const handleSubmit = () => {
    if (!evento || !pensamentos || !comportamento || selectedEmotions.length === 0) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione pelo menos uma emoção.');
      return;
    }

    const diaryEntry = {
      timestamp: new Date().toISOString(),
      humor: parseInt(humor),
      emotions: selectedEmotions,
      evento,
      pensamentos,
      comportamento,
    };

    // Simulação de envio para o backend (Microsserviço de Análise Preditiva)
    // Em um ambiente real, esta função faria uma chamada API para o serviço de dados
    // que alimenta o microsserviço de Análise Preditiva.
    console.log('Entrada do Diário Enviada:', diaryEntry);
    Alert.alert('Sucesso', 'Seu registro foi salvo e enviado para análise do seu terapeuta!');

    // Resetar o formulário
    setHumor('5');
    setSelectedEmotions([]);
    setEvento('');
    setPensamentos('');
    setComportamento('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Diário Terapêutico Interativo</Text>
        <Text style={styles.subtitle}>Sinergia Pro - Paciente</Text>

        {/* Nível de Humor */}
        <Text style={styles.label}>Nível de Humor (1 a 10): {humor}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={2}
          value={humor}
          onChangeText={(text) => setHumor(text.replace(/[^1-9]|10/g, ''))}
        />

        {/* Emoções */}
        <Text style={styles.label}>Emoções (Máx. 3):</Text>
        <EmotionPicker selectedEmotions={selectedEmotions} onSelectEmotion={handleSelectEmotion} />

        {/* Evento/Situação */}
        <Text style={styles.label}>Evento/Situação:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={evento}
          onChangeText={setEvento}
          placeholder="Descreva o que aconteceu..."
        />

        {/* Pensamentos */}
        <Text style={styles.label}>Pensamentos Automáticos:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={pensamentos}
          onChangeText={setPensamentos}
          placeholder="O que passou pela sua cabeça..."
        />

        {/* Ações/Comportamento */}
        <Text style={styles.label}>Ações/Comportamento:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={comportamento}
          onChangeText={setComportamento}
          placeholder="Como você reagiu..."
        />

        <View style={styles.buttonContainer}>
          <Button title="Salvar Registro" onPress={handleSubmit} color="#9C27B0" />
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#9C27B0',
  },
  subtitle: {
    fontSize: 16,
    color: '#6A1B9A',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  emotionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  emotionButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emotionText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
});
