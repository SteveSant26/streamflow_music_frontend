// Script para probar la persistencia de reproducción
// Ejecutar en DevTools Console

console.log('🎵 Configurando estado de prueba para persistencia...');

// Simular estado guardado de "BIRDS OF A FEATHER" - Billie Eilish
const testState = {
  currentSong: {
    id: "ba449813-b9d7-4e83-ab2f-63024765ed22",
    title: "BIRDS OF A FEATHER",
    artist_name: "Billie Eilish",
    album: {
      title: "Hit Me Hard and Soft"
    },
    thumbnail_url: "https://i.ytimg.com/vi/V9PVRfjEBTI/maxresdefault.jpg",
    file_url: ""
  },
  currentPlaylist: null,
  playbackPosition: {
    currentTime: 45, // 45 segundos de reproducción
    duration: 200,   // 3:20 total
    progress: 22.5   // 22.5% completado
  },
  playerSettings: {
    volume: 0.7,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false
  },
  timestamp: Date.now()
};

// Guardar en localStorage
localStorage.setItem('streamflow_playback_state', JSON.stringify(testState));

console.log('✅ Estado de prueba guardado!');
console.log('📍 Canción: Billie Eilish - BIRDS OF A FEATHER');
console.log('⏰ Posición: 45 segundos (22.5%)');
console.log('🔊 Volumen: 70%');

console.log('\n🔄 Ahora recarga la página para ver la restauración automática...');
console.log('👀 Deberías ver el mini-player en la parte inferior con la canción cargada');

// Función para limpiar el estado
window.clearTestState = function() {
  localStorage.removeItem('streamflow_playback_state');
  console.log('🗑️ Estado de prueba limpiado');
};

console.log('\n🧹 Para limpiar el estado: clearTestState()');
