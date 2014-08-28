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
});
