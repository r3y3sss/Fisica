        // Variables globales
        let currentTab = 'lenses';
        const c = 3e8; // velocidad de la luz
        const h = 6.626e-34; // constante de Planck

        // Función para cambiar pestañas
        function showTab(tabName) {
            // Ocultar todas las pestañas
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remover clase active de todos los botones
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Mostrar pestaña seleccionada
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            
            currentTab = tabName;
            
            // Inicializar canvas de la pestaña actual
            setTimeout(() => {
                initializeCanvas(tabName);
            }, 100);
        }

        // Inicializar canvas según la pestaña
        function initializeCanvas(tabName) {
            switch(tabName) {
                case 'lenses':
                    initLensCanvas();
                    updateLensSimulation();
                    break;
                case 'mirrors':
                    initMirrorCanvas();
                    updateMirrorSimulation();
                    break;
                case 'reflection-refraction':
                    initCombinedCanvas();
                    updateCombinedSimulation();
                    break;
                case 'light-models':
                    initLightModelCanvas();
                    updateLightModelSimulation();
                    break;
                case 'spectrum':
                    initSpectrumCanvas();
                    updateSpectrumSimulation();
                    break;
            }
        }

        // SIMULADOR DE LENTES
        function initLensCanvas() {
            const canvas = document.getElementById('lensCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        function updateLensSimulation() {
            const focalLength = parseFloat(document.getElementById('focalLengthSlider').value);
            const objectPosition = parseFloat(document.getElementById('objectPositionSlider').value);
            const lensType = document.getElementById('lensTypeSelect').value;
            
            document.getElementById('focalLengthValue').textContent = focalLength;
            document.getElementById('objectPositionValue').textContent = objectPosition;
            
            // Calcular distancia de imagen
            let imageDistance;
            if (lensType === 'converging') {
                imageDistance = 1 / (1/focalLength - 1/Math.abs(objectPosition));
            } else {
                imageDistance = 1 / (-1/focalLength - 1/Math.abs(objectPosition));
            }
            
            const magnification = -imageDistance / objectPosition;
            
            // Actualizar mediciones
            document.getElementById('imageDistanceValue').textContent = imageDistance.toFixed(1) + ' cm';
            document.getElementById('magnificationValue').textContent = magnification.toFixed(2) + 'x';
            
            let imageType = '';
            if (imageDistance > 0) {
                imageType = magnification > 0 ? 'Virtual, Derecha' : 'Real, Invertida';
            } else {
                imageType = 'Virtual, Derecha';
            }
            document.getElementById('imageTypeValue').textContent = imageType;
            
            // Actualizar fórmulas con datos actuales
            document.getElementById('currentFocalLength').textContent = focalLength;
            document.getElementById('currentObjectDistance').textContent = Math.abs(objectPosition);
            document.getElementById('currentImageDistance').textContent = imageDistance.toFixed(1);
            
            const leftSide = (1/focalLength).toFixed(3);
            const term1 = (1/Math.abs(objectPosition)).toFixed(3);
            const term2 = (1/imageDistance).toFixed(3);
            document.getElementById('lensEquationCalculation').textContent = `${leftSide} = ${term1} + ${term2}`;
            
            document.getElementById('currentImageDistanceM').textContent = imageDistance.toFixed(1);
            document.getElementById('currentObjectDistanceM').textContent = Math.abs(objectPosition);
            document.getElementById('currentMagnification').textContent = magnification.toFixed(2);
            
            const magDesc = Math.abs(magnification) > 1 ? 
                `${Math.abs(magnification).toFixed(1)} veces más grande` : 
                `${Math.abs(magnification).toFixed(1)} veces más pequeña`;
            const orientation = magnification > 0 ? ' y derecha' : ' e invertida';
            document.getElementById('magnificationDescription').textContent = magDesc + orientation;
            
            document.getElementById('currentFocalLengthP').textContent = (focalLength/100).toFixed(2);
            document.getElementById('currentPower').textContent = (1/(focalLength/100)).toFixed(1);
            
            drawLensSimulation(focalLength, objectPosition, imageDistance, lensType, magnification);
        }

        function drawLensSimulation(f, objPos, imgPos, type, mag) {
            const canvas = document.getElementById('lensCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const scale = 3;
            
            // Dibujar eje óptico
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Dibujar lente
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            
            if (type === 'converging') {
                // Lente convergente
                ctx.beginPath();
                ctx.arc(centerX - 15, centerY, 80, -Math.PI/2, Math.PI/2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX + 15, centerY, 80, Math.PI/2, -Math.PI/2);
                ctx.stroke();
            } else {
                // Lente divergente
                ctx.beginPath();
                ctx.arc(centerX + 40, centerY, 80, Math.PI/2, -Math.PI/2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX - 40, centerY, 80, -Math.PI/2, Math.PI/2);
                ctx.stroke();
            }
            
            // Dibujar focos
            ctx.fillStyle = '#ff6600';
            const focalPixels = f * scale;
            ctx.fillRect(centerX - focalPixels - 3, centerY - 3, 6, 6);
            ctx.fillRect(centerX + focalPixels - 3, centerY - 3, 6, 6);
            
            // Etiquetas F
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.fillText('F', centerX - focalPixels - 10, centerY + 20);
            ctx.fillText('F', centerX + focalPixels + 5, centerY + 20);
            
            // Dibujar objeto
            const objX = centerX + objPos * scale;
            const objHeight = 40;
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(objX, centerY);
            ctx.lineTo(objX, centerY - objHeight);
            ctx.stroke();
            
            // Flecha del objeto
            ctx.beginPath();
            ctx.moveTo(objX, centerY - objHeight);
            ctx.lineTo(objX - 5, centerY - objHeight + 8);
            ctx.lineTo(objX + 5, centerY - objHeight + 8);
            ctx.closePath();
            ctx.fill();
            
            // Dibujar imagen si es real
            if (imgPos > 0) {
                const imgX = centerX + imgPos * scale;
                const imgHeight = objHeight * Math.abs(mag);
                
                ctx.strokeStyle = '#0000ff';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(imgX, centerY);
                if (mag < 0) {
                    ctx.lineTo(imgX, centerY + imgHeight);
                } else {
                    ctx.lineTo(imgX, centerY - imgHeight);
                }
                ctx.stroke();
                
                // Flecha de la imagen
                ctx.fillStyle = '#0000ff';
                ctx.beginPath();
                if (mag < 0) {
                    ctx.moveTo(imgX, centerY + imgHeight);
                    ctx.lineTo(imgX - 5, centerY + imgHeight - 8);
                    ctx.lineTo(imgX + 5, centerY + imgHeight - 8);
                } else {
                    ctx.moveTo(imgX, centerY - imgHeight);
                    ctx.lineTo(imgX - 5, centerY - imgHeight + 8);
                    ctx.lineTo(imgX + 5, centerY - imgHeight + 8);
                }
                ctx.closePath();
                ctx.fill();
            }
            
            // Dibujar rayos principales
            drawPrincipalRays(ctx, centerX, centerY, objX, objHeight, f * scale, type);
        }

        function drawPrincipalRays(ctx, centerX, centerY, objX, objHeight, focalPixels, type) {
            ctx.strokeStyle = '#00aa00';
            ctx.lineWidth = 2;
            
            // Rayo paralelo al eje
            ctx.beginPath();
            ctx.moveTo(objX, centerY - objHeight);
            ctx.lineTo(centerX, centerY - objHeight);
            
            if (type === 'converging') {
                ctx.lineTo(centerX + focalPixels, centerY);
            } else {
                // Para divergente, el rayo parece venir del foco
                ctx.lineTo(canvas.width, centerY - objHeight + (canvas.width - centerX) * objHeight / focalPixels);
            }
            ctx.stroke();
            
            // Rayo que pasa por el centro
            ctx.beginPath();
            ctx.moveTo(objX, centerY - objHeight);
            ctx.lineTo(centerX, centerY - objHeight);
            ctx.lineTo(canvas.width, centerY - objHeight);
            ctx.stroke();
        }

        // SIMULADOR DE ESPEJOS
        function initMirrorCanvas() {
            const canvas = document.getElementById('mirrorCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        function updateMirrorSimulation() {
            const radius = parseFloat(document.getElementById('radiusSlider').value);
            const objectPosition = parseFloat(document.getElementById('mirrorObjectPositionSlider').value);
            const mirrorType = document.getElementById('mirrorTypeSelect').value;
            
            document.getElementById('radiusValue').textContent = radius;
            document.getElementById('mirrorObjectPositionValue').textContent = objectPosition;
            
            let focalLength = radius / 2;
            if (mirrorType === 'convex') focalLength = -focalLength;
            if (mirrorType === 'plane') focalLength = Infinity;
            
            let imageDistance = 0;
            let magnification = 0;
            
            if (mirrorType !== 'plane') {
                imageDistance = 1 / (1/focalLength - 1/Math.abs(objectPosition));
                magnification = -imageDistance / objectPosition;
            } else {
                imageDistance = -objectPosition;
                magnification = 1;
            }
            
            document.getElementById('mirrorFocalValue').textContent = 
                mirrorType === 'plane' ? '∞' : focalLength.toFixed(1) + ' cm';
            document.getElementById('mirrorImageDistanceValue').textContent = imageDistance.toFixed(1) + ' cm';
            document.getElementById('mirrorMagnificationValue').textContent = magnification.toFixed(2) + 'x';
            
            // Actualizar fórmulas con datos actuales
            if (mirrorType !== 'plane') {
                document.getElementById('currentMirrorFocal').textContent = Math.abs(focalLength).toFixed(1);
                document.getElementById('currentMirrorObjectDist').textContent = Math.abs(objectPosition);
                document.getElementById('currentMirrorImageDist').textContent = imageDistance.toFixed(1);
                
                const leftSide = (1/focalLength).toFixed(3);
                const term1 = (1/Math.abs(objectPosition)).toFixed(3);
                const term2 = (1/imageDistance).toFixed(3);
                document.getElementById('mirrorEquationCalculation').textContent = `${leftSide} = ${term1} + ${term2}`;
                
                document.getElementById('currentMirrorFocalR').textContent = Math.abs(focalLength).toFixed(1);
                document.getElementById('currentRadius').textContent = radius;
                document.getElementById('radiusDescription').textContent = `${radius} cm del espejo`;
                
                document.getElementById('currentMirrorImageDistM').textContent = imageDistance.toFixed(1);
                document.getElementById('currentMirrorObjectDistM').textContent = Math.abs(objectPosition);
                document.getElementById('currentMirrorMagnification').textContent = magnification.toFixed(2);
                
                const magDesc = Math.abs(magnification) > 1 ? 
                    `${Math.abs(magnification).toFixed(1)} veces más grande` : 
                    `${Math.abs(magnification).toFixed(1)} veces más pequeña`;
                const orientation = magnification > 0 ? ' y derecha' : ' e invertida';
                document.getElementById('mirrorMagnificationDescription').textContent = magDesc + orientation;
            }
            
            drawMirrorSimulation(radius, objectPosition, imageDistance, mirrorType, magnification);
        }

        function drawMirrorSimulation(radius, objPos, imgPos, type, mag) {
            const canvas = document.getElementById('mirrorCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width - 100;
            const centerY = canvas.height / 2;
            const scale = 2;
            
            // Dibujar eje óptico
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(canvas.width, centerY);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Dibujar espejo
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 6;
            
            if (type === 'concave') {
                ctx.beginPath();
                ctx.arc(centerX + radius * scale, centerY, radius * scale, Math.PI - 0.5, Math.PI + 0.5);
                ctx.stroke();
            } else if (type === 'convex') {
                ctx.beginPath();
                ctx.arc(centerX - radius * scale, centerY, radius * scale, -0.5, 0.5);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 80);
                ctx.lineTo(centerX, centerY + 80);
                ctx.stroke();
            }
            
            // Dibujar foco si no es plano
            if (type !== 'plane') {
                ctx.fillStyle = '#ff6600';
                const focalPixels = (radius / 2) * scale;
                if (type === 'concave') {
                    ctx.fillRect(centerX - focalPixels - 3, centerY - 3, 6, 6);
                    ctx.fillStyle = '#333';
                    ctx.font = '14px Arial';
                    ctx.fillText('F', centerX - focalPixels - 10, centerY + 20);
                }
            }
            
            // Dibujar objeto
            const objX = centerX + objPos * scale;
            const objHeight = 40;
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(objX, centerY);
            ctx.lineTo(objX, centerY - objHeight);
            ctx.stroke();
            
            // Flecha del objeto
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(objX, centerY - objHeight);
            ctx.lineTo(objX - 5, centerY - objHeight + 8);
            ctx.lineTo(objX + 5, centerY - objHeight + 8);
            ctx.closePath();
            ctx.fill();
            
            // Dibujar imagen
            if (imgPos !== 0) {
                const imgX = centerX + imgPos * scale;
                const imgHeight = objHeight * Math.abs(mag);
                
                ctx.strokeStyle = imgPos > 0 ? '#0000ff' : '#ff00ff';
                ctx.lineWidth = 3;
                ctx.setLineDash(imgPos > 0 ? [] : [5, 5]);
                
                ctx.beginPath();
                ctx.moveTo(imgX, centerY);
                if (mag < 0) {
                    ctx.lineTo(imgX, centerY + imgHeight);
                } else {
                    ctx.lineTo(imgX, centerY - imgHeight);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // SIMULADOR COMBINADO DE REFLEXIÓN Y REFRACCIÓN
        function initCombinedCanvas() {
            const canvas = document.getElementById('combinedCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        function updateCombinedSimulation() {
            const incidenceAngle = parseFloat(document.getElementById('combinedIncidenceSlider').value);
            const n1 = parseFloat(document.getElementById('combinedN1Slider').value);
            const n2 = parseFloat(document.getElementById('combinedN2Slider').value);
            const wavelength = parseFloat(document.getElementById('combinedWavelengthSlider').value);
            const surfaceType = document.getElementById('combinedSurfaceSelect').value;
            
            // Actualizar valores mostrados
            document.getElementById('combinedIncidenceValue').textContent = incidenceAngle;
            document.getElementById('combinedN1Value').textContent = n1.toFixed(1);
            document.getElementById('combinedN2Value').textContent = n2.toFixed(1);
            document.getElementById('combinedWavelengthValue').textContent = wavelength;
            
            // Cálculos
            const reflectionAngle = incidenceAngle;
            const incRad = incidenceAngle * Math.PI / 180;
            const sinRefraction = (n1 * Math.sin(incRad)) / n2;
            
            let refractionAngle = 0;
            let totalReflection = false;
            
            if (Math.abs(sinRefraction) <= 1) {
                refractionAngle = Math.asin(sinRefraction) * 180 / Math.PI;
            } else {
                totalReflection = true;
            }
            
            const criticalAngle = n1 > n2 ? Math.asin(n2/n1) * 180/Math.PI : 90;
            const v1 = c / n1;
            const v2 = c / n2;
            
            // Actualizar mediciones
            document.getElementById('combinedReflectionAngle').textContent = reflectionAngle.toFixed(1) + '°';
            document.getElementById('combinedRefractionAngle').textContent = totalReflection ? 'N/A' : refractionAngle.toFixed(1) + '°';
            document.getElementById('combinedCriticalAngle').textContent = criticalAngle.toFixed(1) + '°';
            document.getElementById('combinedTotalReflection').textContent = totalReflection ? 'Sí' : 'No';
            
            // Actualizar fórmulas con datos actuales
            document.getElementById('currentReflectionAngle').textContent = reflectionAngle.toFixed(1);
            document.getElementById('currentN1').textContent = n1.toFixed(1);
            document.getElementById('currentN2').textContent = n2.toFixed(1);
            document.getElementById('currentIncAngle').textContent = incidenceAngle.toFixed(1);
            document.getElementById('currentRefAngle').textContent = totalReflection ? 'N/A' : refractionAngle.toFixed(1);
            
            // Cálculo de Snell
            const leftSide = n1 * Math.sin(incRad);
            const rightSide = totalReflection ? 'N/A' : (n2 * Math.sin(refractionAngle * Math.PI / 180));
            document.getElementById('snellCalculation').textContent = totalReflection ? 
                `${leftSide.toFixed(2)} > ${n2.toFixed(1)} (Reflexión Total)` : 
                `${leftSide.toFixed(2)} = ${rightSide.toFixed(2)}`;
            
            // Ángulo crítico
            document.getElementById('currentN1Crit').textContent = n1.toFixed(1);
            document.getElementById('currentN2Crit').textContent = n2.toFixed(1);
            document.getElementById('currentCriticalAngle').textContent = criticalAngle.toFixed(1);
            
            // Velocidades
            document.getElementById('currentV1').textContent = (v1/1e8).toFixed(2) + '×10⁸';
            document.getElementById('currentV2').textContent = (v2/1e8).toFixed(2) + '×10⁸';
            
            drawCombinedSimulation(incidenceAngle, reflectionAngle, refractionAngle, n1, n2, wavelength, surfaceType, totalReflection);
        }

        function drawCombinedSimulation(incAngle, reflAngle, refrAngle, n1, n2, wavelength, surfaceType, totalRefl) {
            const canvas = document.getElementById('combinedCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Dibujar medios con diferentes colores según índice de refracción
            ctx.fillStyle = `rgba(100, 150, 255, ${0.2 + n1 * 0.1})`;
            ctx.fillRect(0, 0, canvas.width, centerY);
            
            ctx.fillStyle = `rgba(100, 255, 150, ${0.2 + n2 * 0.1})`;
            ctx.fillRect(0, centerY, canvas.width, centerY);
            
            // Etiquetas de medios
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText(`Medio 1: n₁ = ${n1.toFixed(1)}`, 20, 30);
            ctx.fillText(`Medio 2: n₂ = ${n2.toFixed(1)}`, 20, canvas.height - 20);
            
            // Dibujar interfaz
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            
            if (surfaceType === 'smooth') {
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(canvas.width, centerY);
                ctx.stroke();
            } else {
                // Superficie rugosa
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 10) {
                    const y = centerY + Math.random() * 8 - 4;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            
            // Dibujar normal
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Color basado en longitud de onda
            const color = wavelengthToColor(wavelength);
            
            // Dibujar rayo incidente
            const incRad = incAngle * Math.PI / 180;
            const rayLength = 120;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX - rayLength * Math.sin(incRad), centerY - rayLength * Math.cos(incRad));
            ctx.lineTo(centerX, centerY);
            ctx.stroke();
            
            // Dibujar rayo reflejado
            ctx.strokeStyle = '#ff6b6b';
            ctx.lineWidth = 3;
            if (surfaceType === 'smooth') {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + rayLength * Math.sin(incRad), centerY - rayLength * Math.cos(incRad));
                ctx.stroke();
            } else {
                // Múltiples rayos reflejados para superficie rugosa
                for (let i = 0; i < 5; i++) {
                    const randomAngle = (Math.random() - 0.5) * Math.PI * 0.8;
                    ctx.beginPath();
                    ctx.moveTo(centerX + i * 15 - 30, centerY);
                    ctx.lineTo(centerX + i * 15 - 30 + 60 * Math.sin(randomAngle), 
                              centerY - 60 * Math.cos(Math.abs(randomAngle)));
                    ctx.stroke();
                }
            }
            
            // Dibujar rayo refractado (solo si no hay reflexión total)
            if (!totalRefl) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                const refrRad = refrAngle * Math.PI / 180;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + rayLength * Math.sin(refrRad), centerY + rayLength * Math.cos(refrRad));
                ctx.stroke();
                
                // Etiqueta del rayo refractado
                drawAngle(ctx, centerX, centerY, refrRad, 'θ₂', color);
            }
            
            // Dibujar ángulos
            drawAngle(ctx, centerX, centerY, -incRad, 'θᵢ', color);
            drawAngle(ctx, centerX, centerY, incRad, 'θᵣ', '#ff6b6b');
            
            // Mostrar si hay reflexión total
            if (totalRefl) {
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 18px Arial';
                ctx.fillText('REFLEXIÓN TOTAL', centerX + 50, centerY + 50);
            }
        }

        function drawAngle(ctx, x, y, angle, label, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, 30, -Math.PI/2, -Math.PI/2 + angle, angle > 0);
            ctx.stroke();
            
            ctx.fillStyle = color;
            ctx.font = '12px Arial';
            const labelX = x + 35 * Math.sin(angle/2);
            const labelY = y - 35 * Math.cos(angle/2);
            ctx.fillText(label, labelX, labelY);
        }

        function wavelengthToColor(wavelength) {
            if (wavelength < 380) return '#8B00FF';
            if (wavelength < 440) return '#4B0082';
            if (wavelength < 490) return '#0000FF';
            if (wavelength < 510) return '#00FFFF';
            if (wavelength < 580) return '#00FF00';
            if (wavelength < 645) return '#FFFF00';
            if (wavelength < 750) return '#FF0000';
            return '#FF0000';
        }

        // SIMULADOR DE MODELOS DE LUZ
        function initLightModelCanvas() {
            const canvas = document.getElementById('lightModelCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        function updateLightModelSimulation() {
            const model = document.getElementById('lightModelSelect').value;
            const frequency = parseFloat(document.getElementById('frequencySlider').value) * 1e14;
            const intensity = parseFloat(document.getElementById('intensitySlider').value);
            
            document.getElementById('frequencyValue').textContent = (frequency/1e14).toFixed(2);
            document.getElementById('intensityValue').textContent = intensity;
            
            const wavelength = c / frequency;
            const photonEnergy = h * frequency;
            
            document.getElementById('calculatedWavelengthValue').textContent = (wavelength * 1e9).toFixed(0) + ' nm';
            document.getElementById('photonEnergyValue').textContent = (photonEnergy * 1e19).toFixed(2) + '×10⁻¹⁹ J';
            
            const color = wavelengthToColor(wavelength * 1e9);
            document.getElementById('colorValue').textContent = getColorName(wavelength * 1e9);
            
            // Actualizar fórmulas con datos actuales
            document.getElementById('currentFrequency').textContent = (frequency/1e14).toFixed(2) + '×10¹⁴';
            document.getElementById('currentPhotonEnergy').textContent = (photonEnergy * 1e19).toFixed(2) + '×10⁻¹⁹';
            document.getElementById('photonEnergyDescription').textContent = (photonEnergy * 1e19).toFixed(2) + '×10⁻¹⁹ J de energía';
            
            document.getElementById('currentFrequencyWave').textContent = (frequency/1e14).toFixed(2) + '×10¹⁴';
            document.getElementById('currentWavelength').textContent = (wavelength * 1e9).toFixed(0);
            document.getElementById('wavelengthDescription').textContent = (wavelength * 1e9).toFixed(0) + ' nm (' + getColorName(wavelength * 1e9).toLowerCase() + ')';
            
            document.getElementById('currentWavelengthE').textContent = (wavelength * 1e9).toFixed(0) + '×10⁻⁹';
            document.getElementById('currentEnergyFromWave').textContent = (photonEnergy * 1e19).toFixed(2) + '×10⁻¹⁹';
            document.getElementById('energyConsistency').textContent = '✓ Consistente';
            
            drawLightModelSimulation(model, frequency, intensity, wavelength, color);
        }

        function drawLightModelSimulation(model, freq, intensity, wavelength, color) {
            const canvas = document.getElementById('lightModelCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerY = canvas.height / 2;
            const amplitude = intensity * 0.8;
            
            if (model === 'wave' || model === 'both') {
                // Dibujar onda
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                for (let x = 0; x < canvas.width; x++) {
                    const y = centerY + amplitude * Math.sin((x * 0.02 * freq / 1e14) + Date.now() * 0.01);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                
                // Ejes
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(canvas.width, centerY);
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            if (model === 'particle' || model === 'both') {
                // Dibujar fotones
                ctx.fillStyle = color;
                const numPhotons = Math.floor(intensity / 10);
                
                for (let i = 0; i < numPhotons; i++) {
                    const x = (i * canvas.width / numPhotons + Date.now() * 0.1) % canvas.width;
                    const y = centerY + (Math.random() - 0.5) * 20;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fill();
                    
                    // Estela del fotón
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x - 15, y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
            
            // Información del modelo
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.fillText(`Modelo: ${model === 'wave' ? 'Ondulatorio' : model === 'particle' ? 'Corpuscular' : 'Dualidad'}`, 20, 30);
            ctx.fillText(`λ = ${(wavelength * 1e9).toFixed(0)} nm`, 20, 50);
            ctx.fillText(`f = ${(freq/1e14).toFixed(2)} × 10¹⁴ Hz`, 20, 70);
        }

        function getColorName(wavelength) {
            if (wavelength < 380) return 'Ultravioleta';
            if (wavelength < 450) return 'Violeta';
            if (wavelength < 495) return 'Azul';
            if (wavelength < 570) return 'Verde';
            if (wavelength < 590) return 'Amarillo';
            if (wavelength < 620) return 'Naranja';
            if (wavelength < 750) return 'Rojo';
            return 'Infrarrojo';
        }

        // SIMULADOR DE ESPECTRO ELECTROMAGNÉTICO
        function initSpectrumCanvas() {
            const canvas = document.getElementById('spectrumCanvas');
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        function updateSpectrumSimulation() {
            const wavelength = parseFloat(document.getElementById('spectrumWavelengthSlider').value);
            const scale = document.getElementById('spectrumScaleSelect').value;
            
            let actualWavelength = wavelength;
            switch(scale) {
                case 'um': actualWavelength *= 1000; break;
                case 'mm': actualWavelength *= 1e6; break;
                case 'm': actualWavelength *= 1e9; break;
            }
            
            document.getElementById('spectrumWavelengthValue').textContent = wavelength;
            
            const frequency = c / (actualWavelength * 1e-9);
            const energy = h * frequency;
            
            document.getElementById('spectrumFrequencyValue').textContent = (frequency/1e12).toFixed(2) + ' THz';
            document.getElementById('spectrumEnergyValue').textContent = (energy*1e19).toFixed(2) + '×10⁻¹⁹ J';
            
            const radiationType = getRadiationType(actualWavelength);
            document.getElementById('radiationTypeValue').textContent = radiationType;
            
            // Actualizar fórmulas con datos actuales
            document.getElementById('currentSpectrumWavelength').textContent = actualWavelength.toFixed(0) + '×10⁻⁹';
            document.getElementById('currentSpectrumFrequency').textContent = (frequency/1e14).toFixed(2) + '×10¹⁴';
            document.getElementById('spectrumFrequencyDescription').textContent = (frequency/1e12).toFixed(0) + ' THz (' + radiationType.toLowerCase() + ')';
            
            document.getElementById('currentSpectrumFrequencyE').textContent = (frequency/1e14).toFixed(2) + '×10¹⁴';
            document.getElementById('currentSpectrumEnergy').textContent = (energy*1e19).toFixed(2) + '×10⁻¹⁹';
            
            const energyEV = (energy / 1.602e-19).toFixed(2);
            document.getElementById('spectrumEnergyDescription').textContent = energyEV + ' eV';
            
            document.getElementById('currentRadiationType').textContent = radiationType;
            document.getElementById('currentRange').textContent = getRadiationRange(radiationType);
            document.getElementById('currentApplications').textContent = getApplications(radiationType);
            
            // Actualizar marcador en la barra de espectro
            updateSpectrumMarker(actualWavelength);
            
            drawSpectrumSimulation(actualWavelength, frequency, energy, radiationType);
        }

        function getRadiationRange(type) {
            const ranges = {
                'Ondas de Radio': '> 1 m',
                'Microondas': '1 mm - 1 m',
                'Infrarrojo': '700 nm - 1 mm',
                'Luz Visible': '400-700 nm',
                'Ultravioleta': '10-400 nm',
                'Rayos X': '0.01-10 nm',
                'Rayos Gamma': '< 0.01 nm'
            };
            return ranges[type] || 'Variable';
        }

        function updateSpectrumMarker(wavelength) {
            const marker = document.getElementById('spectrumMarker');
            const spectrumBar = marker.parentElement;
            
            // Mapear longitud de onda visible (400-700nm) a posición en la barra
            if (wavelength >= 400 && wavelength <= 700) {
                const position = ((wavelength - 400) / 300) * 100;
                marker.style.left = position + '%';
                marker.style.display = 'block';
            } else {
                marker.style.display = 'none';
            }
        }

        function selectWavelength(event) {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const percentage = x / rect.width;
            
            // Convertir posición a longitud de onda visible
            const wavelength = 400 + (percentage * 300);
            
            document.getElementById('spectrumWavelengthSlider').value = wavelength;
            document.getElementById('spectrumScaleSelect').value = 'nm';
            
            updateSpectrumSimulation();
        }

        function getRadiationType(wavelength) {
            if (wavelength > 1e6) return 'Ondas de Radio';
            if (wavelength > 1e3) return 'Microondas';
            if (wavelength > 700) return 'Infrarrojo';
            if (wavelength >= 400) return 'Luz Visible';
            if (wavelength > 10) return 'Ultravioleta';
            if (wavelength > 0.01) return 'Rayos X';
            return 'Rayos Gamma';
        }

        function drawSpectrumSimulation(wavelength, freq, energy, type) {
            const canvas = document.getElementById('spectrumCanvas');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dibujar representación del tipo de radiación
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            ctx.fillStyle = '#333';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(type, centerX, 50);
            
            // Dibujar onda característica
            const color = wavelength >= 400 && wavelength <= 700 ? wavelengthToColor(wavelength) : '#666';
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            
            const waveLength = Math.log10(wavelength) * 20;
            const amplitude = 50;
            
            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + amplitude * Math.sin((x * 2 * Math.PI) / waveLength);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            // Información adicional
            ctx.fillStyle = '#333';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Longitud de onda: ${wavelength.toFixed(1)} nm`, 20, canvas.height - 80);
            ctx.fillText(`Frecuencia: ${(freq/1e12).toFixed(2)} THz`, 20, canvas.height - 60);
            ctx.fillText(`Energía: ${(energy*1e19).toFixed(2)} × 10⁻¹⁹ J`, 20, canvas.height - 40);
            ctx.fillText(`Aplicaciones: ${getApplications(type)}`, 20, canvas.height - 20);
        }

        function getApplications(type) {
            const applications = {
                'Ondas de Radio': 'Radio, TV, comunicaciones',
                'Microondas': 'Radar, hornos microondas, WiFi',
                'Infrarrojo': 'Visión nocturna, calefacción',
                'Luz Visible': 'Visión, fotografía, iluminación',
                'Ultravioleta': 'Esterilización, bronceado',
                'Rayos X': 'Medicina, seguridad',
                'Rayos Gamma': 'Medicina nuclear, astronomía'
            };
            return applications[type] || 'Investigación científica';
        }

        // Inicialización
        window.addEventListener('resize', () => {
            setTimeout(() => {
                initializeCanvas(currentTab);
            }, 100);
        });

        // Inicializar la primera pestaña
        setTimeout(() => {
            initializeCanvas('lenses');
        }, 100);
        
        // Inicializar simulador combinado por defecto
        setTimeout(() => {
            if (document.getElementById('combinedCanvas')) {
                initCombinedCanvas();
                updateCombinedSimulation();
            }
        }, 200);

        // Animación continua para algunos simuladores
        function animate() {
            if (currentTab === 'light-models') {
                updateLightModelSimulation();
            }
            requestAnimationFrame(animate);
        }
        
        animate();

        (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'98c791c8228adbe5',t:'MTc2MDExNDUzMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();