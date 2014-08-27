$(function () {
    $('.lumpy').lumpy({
        color: {
            begin: [0, 0, 0],
            end: [255, 255, 255]
        },
        steps: 100
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
        steps: 50
    });
});
