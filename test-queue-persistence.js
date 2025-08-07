// 🎵 Script de Prueba - Sistema de Queue/Playlist con Persistencia
// Copia y pega en la consola del navegador en http://localhost:4200

console.log('🎵 Iniciando test de Queue/Playlist con Persistencia...');

// 1. Estado de prueba con PLAYLIST completa
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
  playbackPosition: {
    currentTime: 78,    // 1:18 minutos
    duration: 210,      // 3:30 total
    progress: 37.14     // 37% reproducido
  },
  playerSettings: {
    volume: 0.8,
    isPlaying: false,   // Pausado
    isShuffle: false,
    isRepeat: false     // Sin repeat
  },
  timestamp: Date.now()
};

// 2. Guardar el estado completo
console.log('💾 Guardando estado con playlist de', testPlaylistState.currentPlaylist.songs.length, 'canciones...');
localStorage.setItem('streamflow_playback_state', JSON.stringify(testPlaylistState));

console.log('✅ Estado guardado exitosamente!');
console.log('📋 Playlist guardada:', testPlaylistState.currentPlaylist.name);
console.log('🎵 Canción actual:', testPlaylistState.currentSong.title, 'por', testPlaylistState.currentSong.artist_name);
console.log('⏰ Posición:', Math.floor(testPlaylistState.playbackPosition.currentTime / 60) + ':' + 
            (testPlaylistState.playbackPosition.currentTime % 60).toString().padStart(2, '0'));
console.log('📍 Índice actual:', testPlaylistState.currentPlaylist.currentIndex);

console.log('\n🔄 INSTRUCCIONES DE PRUEBA:');
console.log('1. 🔄 Recarga la página (F5 o Ctrl+R)');
console.log('2. 🎵 El sistema debería restaurar la playlist completa');
console.log('3. ⏭️ Usa los botones Next/Previous para navegar');
console.log('4. ➕ Agrega más canciones con "Add to Queue"');
console.log('5. 💾 Todo se guardará automáticamente');

console.log('\n🕵️ COMANDOS PARA DEBUG:');
console.log('- Ver estado: JSON.parse(localStorage.getItem("streamflow_playback_state"))');
console.log('- Limpiar: localStorage.removeItem("streamflow_playback_state")');
console.log('- Verificar queue: window.playerUseCase?.getCurrentQueue()');

console.log('\n🎯 COMPORTAMIENTO ESPERADO:');
console.log('✅ Restaura la canción "BIRDS OF A FEATHER" en 1:18');
console.log('✅ Botón Next lleva a "good 4 u" de Olivia Rodrigo'); 
console.log('✅ Botón Previous mantiene "BIRDS OF A FEATHER" (primera canción)');
console.log('✅ Al terminar una canción, avanza automáticamente a la siguiente');
console.log('✅ "Add to Queue" agrega canciones al final de la lista');

console.log('\n🔧 FUNCIONALIDADES IMPLEMENTADAS:');
console.log('🎵 Queue completa con navegación Next/Previous');
console.log('💾 Persistencia automática cada 10 segundos');
console.log('🔄 Restauración completa de playlist');
console.log('➕ Add to Queue funcional');
console.log('🔁 Repeat modes (none/one/all)');
console.log('🎲 Shuffle support');

// 3. Simular agregar más canciones a la queue
console.log('\n🎵 BONUS: Simulando canciones adicionales en queue...');
const additionalSongs = [
  {
    id: "song-5-test",
    title: "As It Was",
    artist_name: "Harry Styles",
    thumbnail_url: "https://example.com/as-it-was.jpg"
  },
  {
    id: "song-6-test", 
    title: "Heat Waves",
    artist_name: "Glass Animals",
    thumbnail_url: "https://example.com/heat-waves.jpg"
  }
];

const extendedState = JSON.parse(JSON.stringify(testPlaylistState));
extendedState.currentPlaylist.songs.push(...additionalSongs);
console.log('🎵 Playlist extendida a', extendedState.currentPlaylist.songs.length, 'canciones');

// Opcional: guardar la versión extendida
// localStorage.setItem('streamflow_playback_state', JSON.stringify(extendedState));

console.log('\n🚀 ¡Test preparado! Recarga la página para probar el sistema completo.');
