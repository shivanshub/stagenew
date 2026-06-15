$file = "d:\shivanshu sir\stagenew\The Stage Time Home (offline).html"
$content = [System.IO.File]::ReadAllText($file)
$idx = 2486066
$closeTag = $content.IndexOf('>', $idx)
$endTag = $content.IndexOf('</script>', $closeTag)
$templateJson = $content.Substring($closeTag + 1, $endTag - $closeTag - 1)
$inner = $templateJson.Trim()
if ($inner.StartsWith('"')) { $inner = $inner.Substring(1) }
if ($inner.EndsWith('"')) { $inner = $inner.Substring(0, $inner.Length - 1) }
$decoded = $inner -replace '\\n', "`n" -replace '\\"', '"' -replace '\\/', '/' -replace '\\u003C', '<' -replace '\\u003E', '>' -replace '\\u003c', '<' -replace '\\u003e', '>'

# Save the decoded HTML to a file so we can read it
$decoded | Out-File -FilePath "d:\shivanshu sir\stagenew\decoded_home.html" -Encoding UTF8
Write-Output "Saved decoded HTML. Length: $($decoded.Length)"
