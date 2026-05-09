import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status === 'granted');
      if (status === 'granted') {
        loadPhotos();
      }
    })();
  }, []);

  const loadPhotos = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 100,
    });
    setPhotos(media.assets);
  };

  const keepPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert('Bitti!', 'Tüm fotoğrafları inceledin.');
    }
  };

  const deletePhoto = async () => {
    const photo = photos[currentIndex];
    await MediaLibrary.deleteAssetsAsync([photo]);
    const newPhotos = photos.filter((_, i) => i !== currentIndex);
    setPhotos(newPhotos);
    if (currentIndex >= newPhotos.length) {
      setCurrentIndex(newPhotos.length - 1);
    }
  };

  if (permission === null) return <View />;
  if (!permission) return <Text style={styles.error}>Galeri izni gerekli!</Text>;
  if (photos.length === 0) return <Text style={styles.error}>Fotoğraf yok!</Text>;

  const current = photos[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{currentIndex + 1} / {photos.length}</Text>
      <Image source={{ uri: current.uri }} style={styles.image} resizeMode="contain" />
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.btn, styles.delete]} onPress={deletePhoto}>
          <Text style={styles.btnText}>🗑 Sil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.keep]} onPress={keepPhoto}>
          <Text style={styles.btnText}>✅ Tut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  counter: { color: '#fff', fontSize: 16, marginBottom: 10 },
  image: { width: width, height: height * 0.7 },
  buttons: { flexDirection: 'row', marginTop: 20, gap: 20 },
  btn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  delete: { backgroundColor: '#e74c3c' },
  keep: { backgroundColor: '#2ecc71' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 50 },
});
