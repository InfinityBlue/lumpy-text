$(function() {
    $('.lumpy-color').lumpy({
        color: {
            begin: '#fff',
            end: '#444'
        },
        steps: 60
    });
    $('.lumpy-direction').lumpy({
        color: {
            begin: [68, 68, 68],
            end: [255, 255, 255]
        },
        steps: 60,
        direction: 'begin'
    });
    $('.lumpy-more-color').lumpy({
        color: {
            begin: '#ff87a3',
            end: '#00fa64',
        },
        steps: 100,
    });
    $('.lumpy-opacity').lumpy({
        color: {
            begin: '#ff87a3',
            end: '#00fa64',
            steps: 208,
            direction: 'end'
        },
        opacity: {
            begin: 0.8,
            end: 0.2,
            steps: 100,
            direction: 'end'
        },
        steps: 250,
    });
    $('.lumpy-size').lumpy({
        color: {
            begin: '#ff87a3',
            end: '#00fa64',
            steps: 199,
            direction: 'end'
        },
        opacity: {
            begin: 0.8,
            end: 0.2,
            steps: 100,
            direction: 'end'
        },
        size: {
            begin: '80px',
            end: '20px',
            steps: 22,
        },
        steps: 300,
    });
    $('.lumpy-shadow').lumpy({
        color: {
            begin: '#ff87a3',
            end: '#00fa64',
            direction: 'end'
        },
        opacity: {
            begin: 0.8,
            end: 0.2,
            steps: 100,
            direction: 'end'
        },
        shadow: {
            x: {
                begin: '2px',
                end: '20px',
            },
            y: {
                begin: '5px',
                end: '30px'
            },
            color: {
                begin: '#943',
                end: '#4f8'
            },
            blur: {
                begin: '2px',
                end: '10px'
            },
            direction: 'end',
            steps: 250
        },
        steps: 250,
    });

});
