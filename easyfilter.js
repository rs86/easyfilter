function testPatternAgainstValue(p, v) {
  return !v.includes(p);
}

function updateFilters () {
    console.log('updateFilters');
    
    $('table.ef').each(function(i, table) {
        var patterns = $(table).find('thead tr.ef-filter-row th').map(function (j, columnFilter) {
            if ($(columnFilter).hasClass('ef-column-filter')) {
                var inputBox = $(columnFilter).find('input');
                return inputBox.val();
            } else {
                return "";
            }
        }).toArray();      
       
        $(table).find('tbody tr').each(function (j, row) {
           

            var values = $(row).find('td').map(function (k, cell) {
                return $(cell).text();
            }).toArray();

            patternsAndValues = _.zip(patterns, values);
            results = _.map(patternsAndValues, function (e) {
                return testPatternAgainstValue(e[0], e[1]);
            });

            if (_.any(results)) {
                $(row).hide();
            
            } else {
                $(row).show();
            }

        });


     });

    
}

function setupTable(t) {

    $(t).find('thead')
        .append("<tr class='ef-filter-row'></tr>");

    $(t).find('thead tr.ef-header th').each(function (i, elem) {
        if ($(elem).hasClass('ef-column')) {
            $(t).find('thead tr.ef-filter-row').append("<th class='ef-column-filter'><input class='ef-input'></input></th>"); 
        } else {
            $(t).find('thead tr.ef-filter-row').append("<th class='ef-column-filter-nofilter'></th>"); 
        }
    });

    $(".ef-input").change(function () {
       updateFilters(); 
    });
}

function setupFilters() {
    $("table.ef").each(function () {
        setupTable(this);
    });
}

$(document).ready(setupFilters);
