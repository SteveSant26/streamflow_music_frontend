// 🎵 Script de Prueba - Add to Queue Simplificado
// Copia y pega en la consola del navegador en http://localhost:4200

console.log('🎵 Testing Add to Queue - Sistema Simplificado...');

// 1. Función para simular click en "Add to Queue"
function testAddToQueue(songData) {
  console.log('🎵 Simulando Add to Queue para:', songData.title);
  
  // Verificar si PlayerUseCase está disponible
  if (!window.playerUseCase) {
    console.error('❌ PlayerUseCase no está disponible globalmente');
    return false;
  }
  
  try {
    // Simular el addToQueue
    window.playerUseCase.addToQueue(songData);
    console.log('✅ Canción agregada exitosamente!');
    
    // Verificar el estado actual del queue
    const currentQueue = window.playerUseCase.getCurrentQueue();
    console.log('📋 Queue actual:', currentQueue);
    console.log('🔢 Total canciones en queue:', currentQueue?.length || 0);
    
    return true;
  } catch (error) {
    console.error('❌ Error al agregar a queue:', error);
    return false;
  }
}

// 2. Canciones de prueba para agregar
const testSongs = [
  {
    id: "test-queue-1",
    title: "Shivers",
    artist_name: "Ed Sheeran",
    thumbnail_url: "https://example.com/ed-sheeran-shivers.jpg",
    file_url: "https://example.com/shivers.mp3"
  },
  {
    id: "test-queue-2", 
    title: "Stay",
    artist_name: "The Kid LAROI & Justin Bieber",
    thumbnail_url: "https://example.com/stay.jpg",
    file_url: "https://example.com/stay.mp3"
  },
  {
    id: "test-queue-3",
    title: "Industry Baby",
    artist_name: "Lil Nas X & Jack Harlow", 
    thumbnail_url: "https://example.com/industry-baby.jpg",
    file_url: "https://example.com/industry-baby.mp3"
  }
];

// 3. Verificar estado inicial
console.log('\n🔍 ESTADO INICIAL:');
console.log('📱 PlayerUseCase disponible:', !!window.playerUseCase);

if (window.playerUseCase) {
  const initialQueue = window.playerUseCase.getCurrentQueue();
  console.log('📋 Queue inicial:', initialQueue?.length || 0, 'canciones');
  
  if (initialQueue && initialQueue.length > 0) {
    console.log('🎵 Canciones en queue:');
    initialQueue.forEach((song, index) => {
      console.log(`   ${index + 1}. ${song.title} - ${song.artist_name}`);
    });
  }
} else {
  console.log('⚠️ PlayerUseCase no disponible. ¿El componente del player está cargado?');
}

// 4. Función de prueba automática
function runAutoTest() {
  console.log('\n🤖 EJECUTANDO PRUEBA AUTOMÁTICA...');
  
  testSongs.forEach((song, index) => {
    setTimeout(() => {
      console.log(`\n--- Test ${index + 1}/3 ---`);
      const success = testAddToQueue(song);
      
      if (success && window.playerUseCase) {
        // Verificar que se agregó correctamente
        const currentQueue = window.playerUseCase.getCurrentQueue();
        const addedSong = currentQueue?.find(s => s.id === song.id);
        
        if (addedSong) {
          console.log('✅ Verificación: Canción encontrada en queue');
        } else {
          console.error('❌ Verificación: Canción NO encontrada en queue');
        }
      }
      
      // Al final de todas las pruebas
      if (index === testSongs.length - 1) {
        setTimeout(() => {
          console.log('\n📊 RESUMEN FINAL:');
          if (window.playerUseCase) {
            const finalQueue = window.playerUseCase.getCurrentQueue();
            console.log('🎵 Total canciones en queue:', finalQueue?.length || 0);
            console.log('🎯 Canciones de prueba agregadas:', 
                        finalQueue?.filter(s => s.id.startsWith('test-queue')).length || 0);
          }
        }, 500);
      }
    }, index * 1000); // 1 segundo entre cada prueba
  });
}

// 5. Función para limpiar queue de prueba
function cleanTestQueue() {
  console.log('\n🧹 LIMPIANDO QUEUE DE PRUEBA...');
  
  if (!window.playerUseCase) {
    console.error('❌ PlayerUseCase no disponible');
    return;
  }
  
  const currentQueue = window.playerUseCase.getCurrentQueue();
  const testSongsInQueue = currentQueue?.filter(s => s.id.startsWith('test-queue')) || [];
  
  console.log('🗑️ Encontradas', testSongsInQueue.length, 'canciones de prueba para eliminar');
  
  // Nota: Necesitaríamos un método removeFromQueue en PlayerUseCase
  console.log('⚠️ Función de eliminación no implementada aún');
}

// 6. Estado simplificado - verificar localStorage
function checkPersistedState() {
  console.log('\n💾 VERIFICANDO ESTADO PERSISTIDO:');
  
  const saved = localStorage.getItem('streamflow_playback_state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      console.log('✅ Estado encontrado en localStorage');
      console.log('🎵 Canción actual:', state.currentSong?.title);
      console.log('📋 Playlist:', state.currentPlaylist?.name);
      console.log('🔢 Canciones en playlist:', state.currentPlaylist?.songs?.length || 0);
      console.log('❌ NO incluye posición de tiempo (simplificado)');
      
      // Verificar que no hay playbackPosition
      if (!state.playbackPosition) {
        console.log('✅ Confirmado: Sistema simplificado sin tracking de tiempo');
      } else {
        console.log('⚠️ Advertencia: Aún hay datos de posición de tiempo');
      }
    } catch (error) {
      console.error('❌ Error parseando estado:', error);
    }
  } else {
    console.log('📭 No hay estado guardado');
  }
}

// 7. Comandos disponibles
console.log('\n🔧 COMANDOS DISPONIBLES:');
console.log('runAutoTest() - Ejecuta prueba automática de 3 canciones');
console.log('testAddToQueue(song) - Prueba agregar una canción específica');
console.log('cleanTestQueue() - Limpia canciones de prueba del queue');
console.log('checkPersistedState() - Verifica estado en localStorage');

console.log('\n🎯 COMPORTAMIENTO ESPERADO (SIMPLIFICADO):');
console.log('✅ Agrega canciones al final de la queue actual');
console.log('✅ No interfiere con la canción reproduciéndose actualmente');
console.log('✅ Queue se guarda automáticamente (sin posición de tiempo)');
console.log('✅ Funciona tanto con playlist como con canción individual');
console.log('❌ NO guarda ni restaura posición de reproducción');

console.log('\n🚀 Ejecuta runAutoTest() para empezar las pruebas!');
