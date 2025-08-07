// 🎵 Script de Prueba - Sistema de Queue/Playlist Simplificado
// Copia y pega en la consola del navegador en http://localhost:4200

console.log('🎵 Iniciando test de Queue/Playlist Simplificado...');

// 1. Estado de prueba SIMPLIFICADO - solo información de música, SIN posición de tiempo
const testPlaylistState = {
  currentSong: {
    id: "ba449813-b9d7-4e83-ab2f-63024765ed22",
    title: "BIRDS OF A FEATHER",
    artist_name: "Billie Eilish",
    thumbnail_url: "https://i.ytimg.com/vi/V9PVRfjEBTI/maxresdefault.jpg",
    file_url: "https://example.com/billie-eilish-birds.mp3"
  },
  currentPlaylist: {
    id: "playlist-test-123",
    name: "Mi Lista de Prueba",
    songs: [
      {
        id: "ba449813-b9d7-4e83-ab2f-63024765ed22",
        title: "BIRDS OF A FEATHER",
        artist_name: "Billie Eilish",
        thumbnail_url: "https://i.ytimg.com/vi/V9PVRfjEBTI/maxresdefault.jpg"
      },
      {
        id: "song-2-test",
        title: "good 4 u",
        artist_name: "Olivia Rodrigo",
        thumbnail_url: "https://example.com/olivia-cover.jpg"
      },
      {
        id: "song-3-test", 
        title: "Blinding Lights",
        artist_name: "The Weeknd",
        thumbnail_url: "https://example.com/weeknd-cover.jpg"
      },
      {
        id: "song-4-test",
        title: "Watermelon Sugar",
        artist_name: "Harry Styles", 
        thumbnail_url: "https://example.com/harry-cover.jpg"
      }
    ],
    currentIndex: 0 // Empezando con BIRDS OF A FEATHER
  },
  // SIMPLIFICADO: Solo configuración básica, sin posición de tiempo
  playerSettings: {
    volume: 0.8,
    isShuffle: false,
    isRepeat: false
  },
  timestamp: Date.now()
};

// 2. Guardar el estado completo
console.log('💾 Guardando estado simplificado con playlist de', testPlaylistState.currentPlaylist.songs.length, 'canciones...');
localStorage.setItem('streamflow_playback_state', JSON.stringify(testPlaylistState));

console.log('✅ Estado guardado exitosamente!');
console.log('📋 Playlist guardada:', testPlaylistState.currentPlaylist.name);
console.log('🎵 Canción actual:', testPlaylistState.currentSong.title, 'por', testPlaylistState.currentSong.artist_name);
console.log('📍 Índice actual:', testPlaylistState.currentPlaylist.currentIndex);

console.log('\n🔄 INSTRUCCIONES DE PRUEBA:');
console.log('1. 🔄 Recarga la página (F5 o Ctrl+R)');
console.log('2. 🎵 El sistema debería restaurar la playlist SIN posición de tiempo');
console.log('3. ▶️ Presiona Play para empezar desde el principio');
console.log('4. ⏭️ Usa Next/Previous para navegar en la playlist');
console.log('5. ➕ Agrega más canciones con "Add to Queue"');
console.log('6. 💾 Solo se guarda la información de música, NO el tiempo');

console.log('\n🕵️ COMANDOS PARA DEBUG:');
console.log('- Ver estado: JSON.parse(localStorage.getItem("streamflow_playback_state"))');
console.log('- Limpiar: localStorage.removeItem("streamflow_playback_state")');
console.log('- Verificar queue: window.playerUseCase?.getCurrentQueue()');

console.log('\n🎯 COMPORTAMIENTO ESPERADO SIMPLIFICADO:');
console.log('✅ Restaura la canción "BIRDS OF A FEATHER" desde el PRINCIPIO (0:00)');
console.log('✅ Botón Next lleva a "good 4 u" de Olivia Rodrigo'); 
console.log('✅ Botón Previous mantiene "BIRDS OF A FEATHER" (primera canción)');
console.log('✅ Al terminar una canción, avanza automáticamente a la siguiente');
console.log('✅ "Add to Queue" agrega canciones al final de la lista');
console.log('❌ NO restaura posición de tiempo - siempre empieza desde 0:00');

console.log('\n🔧 VENTAJAS DEL SISTEMA SIMPLIFICADO:');
console.log('⚡ Más rápido - no guarda cada segundo');
console.log('� Menos batería - no hay intervalos constantes');
console.log('💾 Menos espacio - solo guarda lo esencial');
console.log('🎵 Foco en la música - playlist y queue son lo importante');
console.log('🔄 Más confiable - menos puntos de fallo');

// 3. Comparación con el sistema anterior
console.log('\n📊 COMPARACIÓN - ANTES vs AHORA:');
console.log('❌ ANTES: Guardaba currentTime, duration, progress cada 10s');
console.log('✅ AHORA: Solo guarda currentSong + playlist + configuración básica');
console.log('❌ ANTES: Restauraba en la posición exacta donde se pausó');
console.log('✅ AHORA: Restaura la canción desde el principio (0:00)');
console.log('❌ ANTES: Complicado, muchos timers, muchos datos');
console.log('✅ AHORA: Simple, eficiente, solo lo esencial');

console.log('\n🚀 ¡Test preparado! Recarga la página para probar el sistema simplificado.');
