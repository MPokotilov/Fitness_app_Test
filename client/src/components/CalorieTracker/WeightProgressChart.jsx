import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Chart from 'chart.js/auto';
import cyclistGif from './bicyclist.gif';
import copCarGif from './car.gif';

const WeightProgressChart = ({ labels, data, theme, showCops }) => {
  const chartRef = useRef(null);
  const cyclistRef = useRef(null);
  const copCarRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const initializeChart = () => {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Weight Progress',
              data: data,
              borderColor: theme.primary,
              backgroundColor: theme.bgLight + '80',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          animation: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
                color: theme.text_primary,
              },
              ticks: {
                color: theme.text_primary,
              },
              grid: {
                color: theme.text_secondary + '80',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Weight (kg)',
                color: theme.text_primary,
              },
              ticks: {
                color: theme.text_primary,
              },
              grid: {
                color: theme.text_secondary + '80',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: theme.text_primary,
              },
            },
          },
        },
      });
    };

    initializeChart();
  }, [labels, data, theme]);

  useEffect(() => {
    // Запускаем анимацию только если флаг showCops активирован
    if (showCops) {
      animateCyclist();
    }
  }, [showCops]);

  const animateCyclist = () => {
    const datasetMeta = chartInstance.current.getDatasetMeta(0);
    const points = datasetMeta.data;
    if (points.length === 0) {
      console.log('No points available for animation');
      return;
    }
  
    // Получаем координаты всех точек графика
    const positions = points.map((point) => ({
      x: point.getProps(['x'], true).x,
      y: point.getProps(['y'], true).y,
    }));
  
    let frame = 0;
    const totalFrames = 200; // Количество кадров для плавности анимации
  
    const animate = () => {
      if (frame >= totalFrames) return;
  
      const progress = frame / totalFrames;
      const totalPoints = positions.length - 1;
      const currentIndex = Math.floor(progress * totalPoints);
      const t = (progress * totalPoints) % 1;
  
      if (currentIndex >= totalPoints) return;
  
      const currentPoint = positions[currentIndex];
      const nextPoint = positions[currentIndex + 1];
  
      // Линейная интерполяция для вычисления текущей позиции между двумя точками графика
      const x = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
      const y = currentPoint.y + (nextPoint.y - currentPoint.y) * t;
  
      // Привязка положения велосипедиста точно к линии графика
      cyclistRef.current.style.left = `${x - 25}px`;  // Центрируем велосипедиста по X
      cyclistRef.current.style.top = `${y - 25}px`;   // Центрируем по Y
  

      copCarRef.current.style.left = `${x - 95}px`;
      copCarRef.current.style.top = `${y - 35}px`;
      
  
      frame++;
      requestAnimationFrame(animate);
    };
  
    animate();
  };
  
  
  
  

  return (
    <ChartWrapper>
      <canvas ref={chartRef}></canvas>
      <CyclistImage ref={cyclistRef} src={cyclistGif} alt="Cyclist animation" />
      {showCops && <CopCarImage ref={copCarRef} src={copCarGif} alt="Cop Car Chasing" />}
    </ChartWrapper>
  );
};

export default WeightProgressChart;

// Стили
const ChartWrapper = styled.div`
  position: relative;
  width: 60%;
  height: 800px;
`;

const CyclistImage = styled.img`
  position: absolute;
  width: 60px;
  height: auto;
  left: 0;
  top: 0;
`;

const CopCarImage = styled.img`
  position: absolute;
  width: 70px;
  height: 70px;
  left: 0;
  top: 0;
`;
