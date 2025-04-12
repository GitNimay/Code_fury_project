$ErrorActionPreference = "Stop"

# Get the current directory
$repoRoot = "E:\Projects\interviewmate-connect-2\interviewmate-connect"
cd $repoRoot

# Create a directory to temporarily store client files
$tempDir = "temp_client_files"
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy client files excluding node_modules
Write-Host "Copying client files to temporary directory..."
Get-ChildItem -Path "client" -Recurse -File | 
    Where-Object { 
        $_.FullName -notlike "*\node_modules\*" -and 
        $_.FullName -notlike "*\.git\*" 
    } | 
    ForEach-Object {
        $relativePath = $_.FullName.Substring($repoRoot.Length + 8)  # +8 to remove "\client\"
        $targetPath = Join-Path $tempDir $relativePath
        $targetDir = Split-Path -Parent $targetPath
        
        if (!(Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        Copy-Item -Path $_.FullName -Destination $targetPath -Force
    }

# Add the client to git directly
Write-Host "Adding client files to git..."
git rm --cached -r client
git add $tempDir

# Rename temp_client_files back to client
git mv $tempDir client

Write-Host "Done. Now you can commit and push the changes."
