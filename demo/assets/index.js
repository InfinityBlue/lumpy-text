$(function () {
    $('.lumpy').lumpy({
        begin: [0, 0, 0],
        end: [255, 255, 255],
        steps: 100
    });

    $('.lumpy-text').lumpy({
        begin: '#058',
        end: '#930',
        steps: 50
    });
});
