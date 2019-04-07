var menuLeft = [
    {title: 'Rain 1', url: 'index.html'},
    {title: 'Rain 2', url: 'example-2.html'},
    {title: 'Ripples', url: 'example-3.html'},
    {title: 'Emulation1', url: 'example-4.html'},
    {title: 'Wind', url: 'example-5.html'}
];

function addMenuEntries(definition, element, classNames){
    var nav = $('<div><ul></ul></div>)');
    nav.addClass(classNames);
    $.each(definition, function(index, entry){
        var elm = $('<li><a href="' + entry.url + '">'+ entry.title +'</a></li>');
        if(window.location.pathname.indexOf(entry.url) > -1){
            elm.addClass('active');
        }
        nav.find('ul').append(elm);
    });
    element.append(nav);
}

addMenuEntries(menuLeft, $('body'), 'nav left');