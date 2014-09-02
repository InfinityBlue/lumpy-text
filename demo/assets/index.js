$(function () {
    $('.lumpy').lumpy({
        color: {
            begin: [0, 0, 0],
            end: [255, 255, 255],
            steps: 60,
            direction: 'end'
        },
        size: {
            begin: '20px',
            end: '80px',
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
                end: '5px'
            }
        },
        steps: 300,
        direction: 'begin'
    });

    $('.lumpy-text').lumpy({
        color: {
            begin: '#058',
            end: '#930'
        },
        opacity: {
            begin: 0.1,
            end: 0.3,
            steps: 4,
            direction: 'begin'
        },
        size: {
            begin: '20px',
            end: '60px'
        },
        steps: 50
    });
});
