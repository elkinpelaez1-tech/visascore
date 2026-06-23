Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Usuario\.antigravity\APPS\VisaScore\visascore_flyer.png"
$destPath = "C:\Users\Usuario\.antigravity\APPS\VisaScore\visascore_flyer_mobile.jpg"

if (Test-Path $sourcePath) {
    $img = [System.Drawing.Image]::FromFile($sourcePath)

    # Resolve dimensions
    $targetW = 1080
    $targetH = 1920
    $bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Fill background with VisaScore Blue (#002868)
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 40, 104))
    $graph.FillRectangle($bgBrush, 0, 0, $targetW, $targetH)
    $bgBrush.Dispose()

    # Calculate padding and size to fit inside 1080x1920
    $ratio = $img.Width / $img.Height
    $newWidth = $targetW
    $newHeight = [int]($newWidth / $ratio)

    if ($newHeight -gt $targetH) {
        $newHeight = $targetH
        $newWidth = [int]($newHeight * $ratio)
    }

    $x = ($targetW - $newWidth) / 2
    $y = ($targetH - $newHeight) / 2

    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($img, $x, $y, $newWidth, $newHeight)

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    $graph.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    Write-Host "Imagen convertida: visascore_flyer_mobile.jpg"
} else {
    Write-Host "No se encontro el flyer original"
}
