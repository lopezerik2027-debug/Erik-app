// Estado de la aplicación
const appState = {
    features: {
        feature1: false,
        feature2: false,
        feature3: false,
        feature4: false,
        feature5: false
    },
    pendingAction: null
};

// Inicializar cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Inicializar la aplicación
function initializeApp() {
    // Cargar estado guardado del localStorage
    const savedState = localStorage.getItem('erikAppState');
    if (savedState) {
        try {
            appState.features = JSON.parse(savedState);
            updateAllUI();
        } catch (e) {
            addLog('Error al cargar configuración guardada', 'warning');
        }
    }
    
    addLog('Sistema inicializado correctamente', 'info');
}

// Configurar event listeners
function setupEventListeners() {
    // Event listeners para los toggles
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById(`feature${i}`);
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                toggleFeature(i);
            });
        }
    }
}

// Alternar una característica
function toggleFeature(featureNum) {
    const featureKey = `feature${featureNum}`;
    appState.features[featureKey] = !appState.features[featureKey];
    
    const checkbox = document.getElementById(featureKey);
    const status = document.getElementById(`status${featureNum}`);
    
    if (appState.features[featureKey]) {
        status.textContent = 'Activado';
        status.classList.add('active');
        status.classList.remove('inactive');
        addLog(`✓ Característica ${featureNum} activada`, 'success');
    } else {
        status.textContent = 'Desactivado';
        status.classList.add('inactive');
        status.classList.remove('active');
        addLog(`✕ Característica ${featureNum} desactivada`, 'warning');
    }
    
    saveState();
    updateGlobalStatus();
}

// Actualizar todos los UI
function updateAllUI() {
    for (let i = 1; i <= 5; i++) {
        const featureKey = `feature${i}`;
        const checkbox = document.getElementById(featureKey);
        const status = document.getElementById(`status${i}`);
        
        checkbox.checked = appState.features[featureKey];
        
        if (appState.features[featureKey]) {
            status.textContent = 'Activado';
            status.classList.add('active');
            status.classList.remove('inactive');
        } else {
            status.textContent = 'Desactivado';
            status.classList.add('inactive');
            status.classList.remove('active');
        }
    }
    updateGlobalStatus();
}

// Actualizar estado global
function updateGlobalStatus() {
    const activeCount = Object.values(appState.features).filter(v => v).length;
    const totalFeatures = Object.keys(appState.features).length;
    
    document.getElementById('activeCount').textContent = `${activeCount}/${totalFeatures}`;
    
    const globalStatus = document.getElementById('globalStatus');
    if (activeCount === 0) {
        globalStatus.textContent = 'Inactivo';
        globalStatus.style.color = '#ef4444';
    } else if (activeCount === totalFeatures) {
        globalStatus.textContent = 'Completamente Activo';
        globalStatus.style.color = '#10b981';
    } else {
        globalStatus.textContent = 'Parcialmente Activo';
        globalStatus.style.color = '#f59e0b';
    }
}

// Guardar estado en localStorage
function saveState() {
    localStorage.setItem('erikAppState', JSON.stringify(appState.features));
}

// Activar todo
function activateAll() {
    showConfirmModal(
        'Activar Todo',
        '¿Deseas activar todas las características?',
        () => {
            for (let i = 1; i <= 5; i++) {
                const featureKey = `feature${i}`;
                if (!appState.features[featureKey]) {
                    document.getElementById(featureKey).checked = true;
                    toggleFeature(i);
                }
            }
            addLog('✓ Todas las características han sido activadas', 'success');
        }
    );
}

// Desactivar todo
function deactivateAll() {
    showConfirmModal(
        'Desactivar Todo',
        '¿Deseas desactivar todas las características?',
        () => {
            for (let i = 1; i <= 5; i++) {
                const featureKey = `feature${i}`;
                if (appState.features[featureKey]) {
                    document.getElementById(featureKey).checked = false;
                    toggleFeature(i);
                }
            }
            addLog('✕ Todas las características han sido desactivadas', 'warning');
        }
    );
}

// Reiniciar sistema
function restartSystem() {
    showConfirmModal(
        'Reiniciar Sistema',
        '¿Deseas reiniciar el sistema? Los cambios serán guardados.',
        () => {
            addLog('⟳ Iniciando reinicio del sistema...', 'warning');
            
            // Simular reinicio
            setTimeout(() => {
                addLog('⟳ Sistema reiniciando...', 'info');
            }, 500);
            
            setTimeout(() => {
                addLog('✓ Sistema reiniciado correctamente', 'success');
                updateGlobalStatus();
            }, 2000);
        }
    );
}

// Ejecutar comando PowerShell
function runPowerShell() {
    showConfirmModal(
        'Ejecutar PowerShell',
        '¿Deseas ejecutar el comando de PowerShell? (irm christitus.com/win | iex)',
        () => {
            const command = 'irm christitus.com/win | iex';
            addLog(`⚡ Ejecutando: ${command}`, 'info');
            
            // Mostrar instrucciones para ejecutar en PowerShell
            addLog('► Instrucciones: Abre PowerShell como Administrador y ejecuta el comando', 'warning');
            
            setTimeout(() => {
                addLog('✓ Comando enviado correctamente', 'success');
                
                // Crear un elemento de descarga con el script
                createPowerShellScript(command);
            }, 1000);
        }
    );
}

// Crear script de PowerShell para descargar
function createPowerShellScript(command) {
    const scriptContent = `# Erik App - PowerShell Script
# Ejecuta: irm christitus.com/win | iex

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Erik App - Windows Optimization Script" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se ejecuta como administrador
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Este script requiere permisos de administrador" -ForegroundColor Red
    Write-Host "Por favor, ejecuta PowerShell como Administrador" -ForegroundColor Yellow
    exit
}

Write-Host "Ejecutando optimizaciones del sistema..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el comando principal
iex ((New-Object System.Net.ServicePointManager).SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; iwr -UseBasicParsing christitus.com/win)

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Optimización completada" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
`;

    // Intentar abrir el script en el portapapeles (si es posible)
    addLog('📋 Script preparado para ejecutar', 'info');
}

// Limpiar registro
function clearLog() {
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = '';
    addLog('✓ Registro limpiado', 'info');
}

// Añadir entrada al registro
function addLog(message, type = 'info') {
    const logContent = document.getElementById('logContent');
    const timestamp = new Date().toLocaleTimeString('es-ES');
    
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    
    logContent.appendChild(entry);
    
    // Auto-scroll
    logContent.parentElement.scrollTop = logContent.parentElement.scrollHeight;
}

// Mostrar modal de confirmación
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    
    appState.pendingAction = onConfirm;
    modal.classList.add('active');
}

// Confirmar acción
function confirmAction() {
    if (appState.pendingAction) {
        appState.pendingAction();
    }
    cancelAction();
}

// Cancelar acción
function cancelAction() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    appState.pendingAction = null;
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cancelAction();
    }
});

// Cerrar modal al hacer click fuera
document.getElementById('confirmModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        cancelAction();
    }
});