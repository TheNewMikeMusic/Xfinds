# PowerShell script to fix garbled commit messages

# Function to rewrite commit message
function Rewrite-Commit {
    param(
        [string]$CommitHash,
        [string]$NewMessage
    )
    
    Write-Host "Rewriting commit $CommitHash..."
    
    # Use git commit --amend for the most recent commit
    # For older commits, we need to use rebase
    
    # Get the commit hash in short format
    $shortHash = git rev-parse --short $CommitHash
    
    Write-Host "Commit $shortHash will be changed to: $NewMessage"
}

# Fix commit messages
Rewrite-Commit "43ecd58" "Update: Legal pages, navbar, environment config and add logo"
Rewrite-Commit "2b11b34" "Improve: Mobile navbar layout and currency selector UI style"
Rewrite-Commit "07d6cda" "Fix: Navbar layout and code quality issues - Fix PC search frame center display - Fix mobile navbar icon layout - Unify currency selector style - Fix code quality issues - Optimize API routes"

Write-Host "`nTo fix these commits, run the following commands manually:"
Write-Host "1. git rebase -i 43ecd58^"
Write-Host "   Change 'pick' to 'reword' for 43ecd58"
Write-Host "   Save and set the new message"
Write-Host ""
Write-Host "2. git rebase -i 2b11b34^"
Write-Host "   Change 'pick' to 'reword' for 2b11b34"
Write-Host "   Save and set the new message"
Write-Host ""
Write-Host "3. git rebase -i 07d6cda^"
Write-Host "   Change 'pick' to 'reword' for 07d6cda"
Write-Host "   Save and set the new message"
Write-Host ""
Write-Host "4. git push --force-with-lease origin main"

