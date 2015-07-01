zip = (a, b) ->
  i = 0
  results = []
  while i < a.length
    results.push([a[i], b[i]])
    i++
  return results

matchText = (pattern, value) -> value.toLowerCase().includes(pattern.toLowerCase())

matchNumber = (pattern, value) ->
  value = value.replace(",", "")
  # If the pattern starts with a digit,
  # then we'll match using equality
  if /^\d/.test(pattern)
    return value.includes(pattern)
  # eval a expression putting value on the LHS
  # and the pattern on the RHS
  return eval(value + pattern)

matchFilter = (filter, value) ->

  # Unpack variables
  pattern = filter['pattern']
  logic = filter['logic']

  # If there is no logic to apply or the pattern is empty,
  # just return true
  if (logic == null) || (pattern.length == 0)
    return true

  # Transfer flow to matchers
  if logic == 'text'
    return matchText(pattern, value)
  else if logic == 'numeric'
    return matchNumber(pattern, value)

  # Default behavior: do not hide the row
  return true

hasInputBox = (elem) -> $(elem).children('input').length > 0

updateTable = (table) ->
  # Make an array with the cells with filter inputs
  cellsWithPatterns = $(table).find('thead tr[filterable-column-inputs] th')

  # Read patterns from cells into an array of objects
  patterns = cellsWithPatterns.map (idx, cell) ->
    if hasInputBox(cell)
      pattern: $(cell).children('input').val()
      logic: $(cell).children('input').attr('filterable-logic')
    else
      pattern: null
      logic: null

  # Get only the DOM objects from the jQuery object
  patterns = patterns.toArray()

  $(table).find('tbody tr').show()

  # Compare each table row to the pattern and
  # hide it
  $(table).find('tbody tr').each (j, row) ->
    values = $(row).find('td').map (i, x) -> $(x).text()
    filterMatches = zip(patterns, values).map (x) -> matchFilter(x[0], x[1])
    i = 0
    while i < filterMatches.length
      if not filterMatches[i]
        $(row).hide()
      i++

updateFilters = ->
  $('table[filterable-table]').each (i, table) ->
    updateTable table

setupTable = (t) ->
  $(t).find('thead').append '<tr filterable-column-inputs></tr>'
  $(t).find('thead tr[filterable-header-row] th').each (i, elem) ->
    if $(elem).is('[filterable-column]')
      $(t).find('thead tr[filterable-column-inputs]')
        .append '<th><input filterable-logic=\'' + $(elem).attr('filterable-logic') + '\'></input></th>'
    else
      $(t).find('thead tr[filterable-column-inputs]')
        .append '<th></th>'
  $('table[filterable-table] thead tr th input').change ->
    updateFilters()

setupFilters = ->
  $('table[filterable-table]').each (i, table) ->
    setupTable table

$(document).ready setupFilters