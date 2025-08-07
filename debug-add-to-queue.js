// 🛠️ Script de Debug - Add to Queue
// Copia y pega en la consola del navegador para debuggear

console.log('🔍 Debug: Add to Queue functionality');

// 1. Verificar si PlayerUseCase está disponible globalmente
console.log('1. Verificando PlayerUseCase...');
if (window.playerUseCase) {
  console.log('✅ PlayerUseCase disponible globalmente');
} else {
  console.log('❌ PlayerUseCase NO disponible globalmente');
  // Intentar obtenerlo desde el injector de Angular
  try {
    const injector = window.ng?.getInjector?.(document.querySelector('app-root'));
    if (injector) {
      const PlayerUseCase = injector.get('PlayerUseCase');
      console.log('✅ PlayerUseCase obtenido desde injector');
      window.playerUseCase = PlayerUseCase;
    }
  } catch (e) {
    console.log('❌ No se pudo obtener PlayerUseCase desde injector');
  }
}

// 2. Verificar estado actual de la queue
console.log('\n2. Estado actual de la queue:');
if (window.playerUseCase) {
  const currentQueue = window.playerUseCase.getCurrentQueue();
  const currentIndex = window.playerUseCase.getCurrentQueueIndex();
  
  console.log('📋 Queue actual:', currentQueue);
  console.log('📍 Índice actual:', currentIndex);
  console.log('📊 Total canciones en queue:', currentQueue?.length || 0);
  
  if (currentQueue?.length > 0) {
    console.log('🎵 Canciones en queue:');
    currentQueue.forEach((song, index) => {
      console.log(`  ${index}: ${song.title} - ${song.artist_name}`);
    });
  }
} else {
  console.log('❌ No se puede verificar queue - PlayerUseCase no disponible');
}

// 3. Función de prueba para simular Add to Queue
console.log('\n3. Función de prueba para Add to Queue:');
window.debugAddToQueue = function(testSong) {
  console.log('🧪 Simulando Add to Queue con canción de prueba...');
  
  const song = testSong || {
    id: 'test-song-' + Date.now(),
    title: 'Canción de Prueba',
    artist_name: 'Artista de Prueba',
    thumbnail_url: 'https://example.com/test.jpg'
  };
  
  try {
    console.log('🎵 Llamando a PlayerUseCase.addToQueue()...');
    window.playerUseCase?.addToQueue(song);
    
    // Verificar resultado
    const newQueue = window.playerUseCase?.getCurrentQueue();
    console.log('✅ Resultado - Nueva queue:', newQueue);
    console.log('📊 Total después de agregar:', newQueue?.length || 0);
    
  } catch (error) {
    console.error('❌ Error en Add to Queue:', error);
  }
};

// 4. Función para verificar si hay eventos de click funcionando
console.log('\n4. Verificando elementos de UI...');
const songActionButtons = document.querySelectorAll('app-song-action-button');
console.log('🔘 Song action buttons encontrados:', songActionButtons.length);

const addToQueueButtons = document.querySelectorAll('[mat-menu-item]');
const addToQueueSpecific = Array.from(addToQueueButtons).filter(btn => 
  btn.textContent?.includes('Agregar a cola') || btn.textContent?.includes('Add to Queue')
);
console.log('➕ Botones "Agregar a cola" encontrados:', addToQueueSpecific.length);

// 5. Agregar listener temporal para detectar clicks
console.log('\n5. Agregando listener temporal para detectar clicks...');
document.addEventListener('click', function(event) {
  const target = event.target;
  if (target.textContent?.includes('Agregar a cola') || target.textContent?.includes('Add to Queue')) {
    console.log('🖱️ Click detectado en "Agregar a cola"!');
    console.log('🎯 Elemento clickeado:', target);
    console.log('🎵 Elemento padre:', target.closest('app-song-action-button'));
  }
}, { once: false });

console.log('\n✅ Debug setup completado!');
console.log('\n📝 INSTRUCCIONES:');
console.log('1. Prueba hacer click en "Agregar a cola" de alguna canción');
console.log('2. Ejecuta: debugAddToQueue() para simular agregar una canción');
console.log('3. Verifica la consola para logs de debug');
console.log('4. Usa: window.playerUseCase.getCurrentQueue() para ver la queue actual');

// 6. Estado inicial para comparar
console.log('\n📊 ESTADO INICIAL:');
if (window.playerUseCase) {
  console.log('Queue inicial:', window.playerUseCase.getCurrentQueue()?.length || 0, 'canciones');
  console.log('Índice inicial:', window.playerUseCase.getCurrentQueueIndex());
}
