// TODO: Exibir filtros só em <th> específicos

function testPatternAgainstValue(p, v) {
  // TODO: Aceitar expressões matemáticas nos filtros (<, >)
  return !v.includes(p);
}

function updateFilters () {
  // TODO: atualizar só o Filterable pai do elemento que disparou o evento
  $('.filterable').each(function() {

    // Cria array com os filtros.
    var patterns = $(this)
                      .find('.filterable-filter-row th input')
                      .map(function() {
                        return $(this).val();
                      }).toArray();

    // Itera por cada linha da tabela e testa se passa no filtro.
    $(this).find('tbody tr').each(function() {
      // Mostra a linha
      $(this).show();

      // Mapeia cada célula da linha para um elemento na array
      var values = $(this)
                      .children()
                      .map(function() {
                        return $(this).text();
                      });

      var patternValuePair = _.zip(patterns, values);
      var patternMatch = _.map(patternValuePair, testPatternAgainstValue);

      // Se algum filtro não passar....
      if (_.any(patternMatch)) {
        $(this).hide();
      }

    }); // $(this).find('tbody tr').each(function() {
  });
}

// A rotina seleciona todas as tabelas com .filterable.
// Cada tabela com filtros deve ter o <thead> bem especificado.
// Nós criaremos uma nova <tr> com class .filterable-filter-row
// dentro do <thead>, e colocaremos uma <th> para cada coluna da tabela.
// Dentro de cada <th>, colocaremos um <input> que será usado para os filtros.
function setupFilters () {
  $("table.filterable").each(function() {
    table = $(this);
    tableHead = table.find('thead');
    tableHead.append("<tr class='filterable-filter-row'></tr>")
    tableHead.find('th').each(function() {
      $('<th><input></input></th>')
        .appendTo(tableHead.find('.filterable-filter-row'))
        .change(function() {
          updateFilters();
        });
    });
  });
}

$(document).ready(setupFilters);
