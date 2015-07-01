function testPatternAgainstValue(v, p, l) {
    if (p.lenght == 0) return true;

    if (l == "text") {
        return v.includes(p);
    } else if (l == "numeric") {
        return eval(v + p)
    }
    return true;
}

function updateTable(table) {

    // Make an array with the cells with filter inputs
    var cellsWithPatterns = $(table).find('thead tr[has-filter-inputs] th');

    // Read patterns from cells into an array of objects
    var patterns = cellsWithPatterns.map(function(idx, cell) {;
        if ($(cell).children('input').length > 0)
            return  {
                        pattern: $(cell).children('input').val(),
                        logic: $(cell).children('input').attr('filter-logic')
                    };
        return {logic: null};
    }).toArray();

    // Compare each table row to the pattern and
    // hide it
    $(table).find('tbody tr').each(function (j, row) {
        var rowCells = $(row).find('td');
        $(row).show();
        for (var i = 0; i < rowCells.length; i++) {
            var text = $(rowCells[i]).text();
            var patt = patterns[i];
            if (patt['logic']) {
                console.log(text, patt['pattern'], testPatternAgainstValue(text, patt['pattern']));

                if (!testPatternAgainstValue(text, patt['pattern'], patt['logic'])) {
                    $(row).hide();
                }
            }
        }
        });
}

function updateFilters () {
    console.log('updateFilters');
    $('table[is-filterable]').each(function(i, table) {
        updateTable(table);
    });
}

function setupTable(t) {

    $(t).find('thead')
        .append("<tr has-filter-inputs></tr>");

    $(t).find('thead tr[has-column-names] th').each(function (i, elem) {
        if ($(elem).attr('is-filter') != null) {
            $(t).find('thead tr[has-filter-inputs]')
                .append("<th><input filter-logic='" + $(elem).attr('filter-logic') + "'></input></th>");
        } else {
            $(t).find('thead tr[has-filter-inputs]')
                .append("<th></th>");
        }
    });

    $("table[is-filterable] thead tr th input").change(function () {
       updateFilters();
    });
}

function setupFilters() {
    $("table[is-filterable]").each(function () {
        setupTable(this);
    });
}

$(document).ready(setupFilters);
