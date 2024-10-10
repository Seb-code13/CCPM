let projects = [];
let complexityCalculated = false;
let uncertaintyCalculated = false;

document.getElementById('complexity-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let score = calculateScore('impact', 'importance');
    document.getElementById('complexity-score').innerText = score;
    addDataToChart(score, 'complexity');
    complexityCalculated = true;
    checkAndResetForms();
});

document.getElementById('uncertainty-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let score = calculateScore('uimpact', 'uimportance');
    document.getElementById('uncertainty-score').innerText = score;
    addDataToChart(score, 'uncertainty');
    uncertaintyCalculated = true;
    checkAndResetForms();
});

function calculateScore(impactPrefix, importancePrefix) {
    let totalScore = 0;
    for (let i = 1; i <= 10; i++) {
        let impact = parseInt(document.getElementById(`${impactPrefix}${i}`).value) || 1;
        let importance = parseInt(document.getElementById(`${importancePrefix}${i}`).value) || 1;
        totalScore += impact * importance;
    }
    return totalScore;
}

function addDataToChart(score, type) {
    if (projects.length === 0 || (projects[projects.length - 1].complexity && projects[projects.length - 1].uncertainty)) {
        projects.push({ complexity: 0, uncertainty: 0, color: getRandomColor() });
    }
    let project = projects[projects.length - 1];
    if (type === 'complexity') {
        project.complexity = score;
    } else if (type === 'uncertainty') {
        project.uncertainty = score;
    }
    if (project.complexity && project.uncertainty) {
        updateChart();
    }
}

function updateChart() {
    let chart = window.resultChart;
    let data = projects.map((project, index) => ({
        x: project.complexity,
        y: project.uncertainty,
        label: `Projet ${index + 1}`,
        backgroundColor: project.color,
        borderColor: project.color,
        pointStyle: 'circle',
        radius: 5
    }));
    if (chart) {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].backgroundColor = data.map(d => d.backgroundColor);
        chart.data.datasets[0].borderColor = data.map(d => d.borderColor);
        chart.data.datasets[0].pointBackgroundColor = data.map(d => d.backgroundColor);
        chart.data.datasets[0].pointBorderColor = data.map(d => d.borderColor);
        chart.update();
    } else {
        createChart(data);
    }
}

function createChart(data) {
    let ctx = document.getElementById('result-chart').getContext('2d');
    window.resultChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Projets',
                data: data,
                backgroundColor: data.map(d => d.backgroundColor),
                borderColor: data.map(d => d.borderColor),
                pointBackgroundColor: data.map(d => d.backgroundColor),
                pointBorderColor: data.map(d => d.borderColor),
                pointStyle: 'circle',
                radius: 5
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 250,
                    title: {
                        display: true,
                        text: 'Complexité'
                    }
                },
                y: {
                    min: 0,
                    max: 250,
                    title: {
                        display: true,
                        text: 'Incertitude'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.raw.label || '';
                            return `${label}: (Complexité: ${context.raw.x}, Incertitude: ${context.raw.y})`;
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        generateLabels: function(chart) {
                            let data = chart.data.datasets[0].data;
                            return data.map(function(item, index) {
                                return {
                                    text: item.label,
                                    fillStyle: item.backgroundColor,
                                    strokeStyle: item.borderColor,
                                    lineWidth: 2,
                                    hidden: false,
                                    index: index
                                };
                            });
                        }
                    }
                },
                annotation: {
                    annotations: {
                        box: {
                            type: 'box',
                            xMin: 0,
                            xMax: 84,
                            yMin: 0,
                            yMax: 84,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    }
                }
            }
        }
    });
}

function resetForms() {
    document.getElementById('complexity-form').reset();
    document.getElementById('uncertainty-form').reset();
    document.getElementById('complexity-score').innerText = '0';
    document.getElementById('uncertainty-score').innerText = '0';
    resetRanges();
}

function resetRanges() {
    var ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach(function(range) {
        range.value = 1;
        range.nextElementSibling.textContent = range.value;
    });
}

function checkAndResetForms() {
    if (complexityCalculated && uncertaintyCalculated) {
        resetForms();
        complexityCalculated = false;
        uncertaintyCalculated = false;
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener("DOMContentLoaded", function() {
    resetRanges();
});

