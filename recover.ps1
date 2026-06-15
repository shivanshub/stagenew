$transcriptPath = "C:\Users\dasta\.gemini\antigravity-ide\brain\c072abfb-9982-481a-a8c5-e343675f9d50\.system_generated\logs\transcript.jsonl"

$lines = Get-Content $transcriptPath
$filesToFind = @(
    "d:\shivanshu sir\stagenew\tailwind.config.js",
    "d:\shivanshu sir\stagenew\src\index.css",
    "d:\shivanshu sir\stagenew\src\components\EventCard.tsx",
    "d:\shivanshu sir\stagenew\src\components\EventCarousel.tsx",
    "d:\shivanshu sir\stagenew\src\components\Footer.tsx",
    "d:\shivanshu sir\stagenew\src\pages\EventDetailsPage.tsx",
    "d:\shivanshu sir\stagenew\src\components\Navbar.tsx"
)

foreach ($target in $filesToFind) {
    # Find the last write_to_file for this target BEFORE the recent changes (which were step 77+)
    # We will just look at the last 500 lines and find the SECOND to last write_to_file for each.
    # Actually, let's parse JSON
    
    $lastMatch = $null
    $secondLastMatch = $null
    
    foreach ($line in $lines) {
        if ($line -match '"tool_calls"') {
            $json = $line | ConvertFrom-Json
            if ($json.tool_calls) {
                foreach ($tc in $json.tool_calls) {
                    if ($tc.function.name -eq 'default_api:write_to_file') {
                        $args = $tc.function.arguments | ConvertFrom-Json
                        if ($args.TargetFile -eq $target) {
                            $secondLastMatch = $lastMatch
                            $lastMatch = $args.CodeContent
                        }
                    }
                }
            }
        }
    }
    
    if ($secondLastMatch) {
        Write-Output "Restoring $target"
        [System.IO.File]::WriteAllText($target, $secondLastMatch)
    } else {
        Write-Output "Could not find previous version for $target"
    }
}
