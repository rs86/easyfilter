function testPatternAgainstValue(v, p) {
  if (p.length == 0)
    return true;
  return v.includes(p);
}

function updateTable(table) {

    var cellsWithPatterns = $(table).find('thead tr.ef-filter-row th');
    var patterns = cellsWithPatterns.map(function(idx, cell) {;
        if ($(cell).children('input').length > 0)
            return  {
                        pattern: $(cell).children('input').val(),
                        logic: $(cell).children('input').attr('filter-logic')
                    };
        return "";
    }).toArray();

    $(table).find('tbody tr').each(function (j, row) {
        var rowCells = $(row).find('td');
        $(row).show();
        for (var i = 0; i < rowCells.length; i++) {
            var text = $(rowCells[i]).text();
            var patt = patterns[i];
            if (patt != "") {
                console.log(text, patt['pattern'], testPatternAgainstValue(text, patt['pattern']));

                if (!testPatternAgainstValue(text, patt['pattern'])) {
                    $(row).hide();
                }
            }
        }
        });
}

function updateFilters () {
    console.log('updateFilters');
    $('table.ef').each(function(i, table) {
        updateTable(table);
    });
}

function setupTable(t) {

    $(t).find('thead')
        .append("<tr class='ef-filter-row'></tr>");

    $(t).find('thead tr.ef-header th').each(function (i, elem) {
        if ($(elem).attr('is-filter')) {
            $(t).find('thead tr.ef-filter-row')
                .append("<th><input filter-logic='" + $(elem).attr('filter-logic') + "'></input></th>");
        } else {
            $(t).find('thead tr.ef-filter-row')
                .append("<th></th>");
        }
    });

    $(".ef thead tr th input").change(function () {
       updateFilters();
    });
}

function setupFilters() {
    $("table.ef").each(function () {
        setupTable(this);
    });
}

$(document).ready(setupFilters);
