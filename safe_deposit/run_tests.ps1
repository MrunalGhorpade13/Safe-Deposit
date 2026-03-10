# Temporarily set crate-type to rlib only for tests, then restore
(Get-Content Cargo.toml -Raw) -replace 'crate-type = \["cdylib", "rlib"\]', 'crate-type = ["rlib"]' | Set-Content Cargo.toml
Write-Host "Running tests..." -ForegroundColor Cyan
cargo test 2>&1
Write-Host ""
Write-Host "Restoring Cargo.toml..." -ForegroundColor Yellow
(Get-Content Cargo.toml -Raw) -replace 'crate-type = \["rlib"\]', 'crate-type = ["cdylib", "rlib"]' | Set-Content Cargo.toml
Write-Host "Done." -ForegroundColor Green
