# 📜 Scripts & Automatisation PowerShell, AD, GPO & AdminSys

Ce document centralise des scripts utiles pour l’administration système Windows/Linux, avec une priorité sur :

- **Active Directory**
- **GPO**
- **audit et hygiène cyber**
- **administration distante**
- **maintenance système**
- **sauvegardes**
- **automatisation Bash/Linux**

L’objectif est d’automatiser les tâches répétitives, limiter les erreurs humaines, gagner du temps et produire des actions reproductibles.

---

## 🧠 0. Philosophie de l’automatisation

Un bon script d’administration doit être :

| Qualité | Explication |
| :--- | :--- |
| **Lisible** | Variables claires, commentaires utiles |
| **Testable** | Possibilité de tester sans modifier la production |
| **Réversible** | Sauvegarde ou journalisation avant action |
| **Traçable** | Logs, exports CSV, transcript |
| **Idempotent** | Peut être relancé sans tout casser |
| **Sécurisé** | Pas de mots de passe en clair, droits minimaux |
| **Documenté** | Entrées, sorties et prérequis indiqués |

---

## ⚠️ 0.1 Règles de sécurité avant exécution

!!! warning
    Toujours tester un script en environnement de lab avant de l’exécuter en production.

Bonnes pratiques :

- lire le script avant exécution ;
- éviter d’exécuter un script trouvé sur Internet sans vérification ;
- lancer PowerShell en administrateur seulement si nécessaire ;
- utiliser `-WhatIf` quand disponible ;
- exporter les objets impactés avant modification ;
- journaliser les actions ;
- limiter la portée avec `-SearchBase` ;
- ne jamais stocker un mot de passe en clair dans un script de production ;
- documenter la date, l’auteur et l’objectif du script.

---

## 🧰 0.2 Prérequis PowerShell pour Active Directory

### Autoriser l'exécution des scripts (Execution Policy)

Par défaut, Windows bloque les scripts. À exécuter une fois en mode Administrateur :

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

Sur un poste d’administration, il faut également installer les outils RSAT.

### Vérifier si le module Active Directory est disponible

```powershell
Get-Module -ListAvailable ActiveDirectory
```

### Importer le module Active Directory

```powershell
Import-Module ActiveDirectory
```

### Vérifier le domaine courant

```powershell
Get-ADDomain
```

### Vérifier le contrôleur de domaine utilisé

```powershell
Get-ADDomainController
```

### Tester une commande simple

```powershell
Get-ADUser -Filter * -ResultSetSize 5
```

---

## 🧱 0.3 Structure conseillée pour un dossier de scripts

```text
C:\Scripts
│
├── AD
│   ├── Users
│   ├── Groups
│   ├── Computers
│   └── Audit
│
├── GPO
│   ├── Backup
│   ├── Reports
│   └── Deploy
│
├── System
│   ├── Services
│   ├── Logs
│   └── Backup
│
├── Exports
│
└── Logs
```

---

## 📋 0.4 Template de script PowerShell propre

```powershell
<#
.SYNOPSIS
    Description courte du script.

.DESCRIPTION
    Description détaillée de ce que fait le script.

.AUTHOR
    Votre nom.

.DATE
    2026-04-26

.NOTES
    À tester en environnement de lab avant production.
#>

# =========================
# Paramètres généraux
# =========================

$ErrorActionPreference = "Stop"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogDir = "C:\Scripts\Logs"
$LogFile = "$LogDir\script_$Date.log"

# =========================
# Préparation
# =========================

if (!(Test-Path $LogDir)) {
    New-Item -Path $LogDir -ItemType Directory -Force | Out-Null
}

Start-Transcript -Path $LogFile

try {
    Write-Host "Début du script..." -ForegroundColor Cyan

    # Votre code ici

    Write-Host "Script terminé avec succès." -ForegroundColor Green
}
catch {
    Write-Host "Erreur : $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Stop-Transcript
}
```

---

# 🏰 1. Active Directory : commandes de base

Active Directory est l’annuaire central des environnements Windows Server.

Il contient notamment :

- utilisateurs ;
- groupes ;
- ordinateurs ;
- unités d’organisation ;
- stratégies de groupe ;
- comptes de service ;
- objets de sécurité.

---

## 🔎 1.1 Rechercher des utilisateurs

### Tous les utilisateurs

```powershell
Get-ADUser -Filter *
```

### Utilisateurs avec propriétés utiles

```powershell
Get-ADUser -Filter * -Properties DisplayName, Mail, Department, Title, Enabled, LastLogonDate |
Select-Object Name, SamAccountName, Mail, Department, Title, Enabled, LastLogonDate
```

### Rechercher un utilisateur par login

```powershell
Get-ADUser -Identity jdupont -Properties *
```

### Rechercher par nom

```powershell
Get-ADUser -Filter 'Name -like "*Dupont*"'
```

### Rechercher les utilisateurs d’une OU

```powershell
Get-ADUser -Filter * -SearchBase "OU=Utilisateurs,DC=studi,DC=srv"
```

---

## 🧾 1.2 Exporter les utilisateurs AD en CSV

```powershell
Import-Module ActiveDirectory

$ExportPath = "C:\Scripts\Exports\export_users_ad.csv"

Get-ADUser -Filter * -Properties DisplayName, Mail, Department, Title, Enabled, LastLogonDate |
Select-Object `
    Name,
    SamAccountName,
    UserPrincipalName,
    Mail,
    Department,
    Title,
    Enabled,
    LastLogonDate |
Export-Csv -Path $ExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Export terminé : $ExportPath" -ForegroundColor Green
```

---

## 🏗️ 1.3 Créer une OU

```powershell
Import-Module ActiveDirectory

$OUName = "Utilisateurs"
$OUPath = "DC=studi,DC=srv"

New-ADOrganizationalUnit `
    -Name $OUName `
    -Path $OUPath `
    -ProtectedFromAccidentalDeletion $true

Write-Host "OU créée : OU=$OUName,$OUPath" -ForegroundColor Green
```

---

## 🏢 1.4 Créer une arborescence d’OU

```powershell
Import-Module ActiveDirectory

$BaseDN = "DC=studi,DC=srv"

$OUs = @(
    "Utilisateurs",
    "Groupes",
    "Ordinateurs",
    "Serveurs",
    "Administration",
    "Quarantaine",
    "Utilisateurs/Direction",
    "Utilisateurs/RH",
    "Utilisateurs/Comptabilite",
    "Utilisateurs/IT",
    "Ordinateurs/PC_Fixes",
    "Ordinateurs/PC_Portables",
    "Serveurs/Production",
    "Serveurs/Test"
)

foreach ($OU in $OUs) {
    $Parts = $OU -split "/"
    $Name = $Parts[-1]

    if ($Parts.Count -eq 1) {
        $Path = $BaseDN
    }
    else {
        $ParentParts = $Parts[0..($Parts.Count - 2)]
        [array]::Reverse($ParentParts)
        $ParentDN = ($ParentParts | ForEach-Object { "OU=$_" }) -join ","
        $Path = "$ParentDN,$BaseDN"
    }

    $FullDN = "OU=$Name,$Path"

    if (!(Get-ADOrganizationalUnit -LDAPFilter "(distinguishedName=$FullDN)" -ErrorAction SilentlyContinue)) {
        New-ADOrganizationalUnit -Name $Name -Path $Path -ProtectedFromAccidentalDeletion $true
        Write-Host "OU créée : $FullDN" -ForegroundColor Green
    }
    else {
        Write-Host "OU déjà existante : $FullDN" -ForegroundColor Yellow
    }
}
```

---

# 👤 2. Active Directory : gestion des utilisateurs

---

## 📄 2.1 Format CSV conseillé pour création d’utilisateurs

Fichier : `C:\Scripts\AD\Users\utilisateurs.csv`

```csv
Prenom,Nom,Login,Password,OU,Department,Title,Mail
Jean,Dupont,jdupont,P@ssw0rd123!,"OU=RH,OU=Utilisateurs,DC=studi,DC=srv",RH,Assistant RH,jdupont@studi.srv
Claire,Martin,cmartin,P@ssw0rd123!,"OU=Comptabilite,OU=Utilisateurs,DC=studi,DC=srv",Comptabilite,Comptable,cmartin@studi.srv
Alex,Bernard,abernard,P@ssw0rd123!,"OU=IT,OU=Utilisateurs,DC=studi,DC=srv",IT,Technicien systèmes,abernard@studi.srv
```

---

## 👥 2.2 Création massive d’utilisateurs depuis CSV

!!! warning "Sécurité des mots de passe"
    Ce script lit les mots de passe en clair depuis un CSV. **Supprimez impérativement le fichier CSV** de votre serveur une fois le script terminé pour éviter une faille critique.

```powershell
Import-Module ActiveDirectory

$CsvPath = "C:\Scripts\AD\Users\utilisateurs.csv"
$LogPath = "C:\Scripts\Logs\creation_users_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"
$DomainUPN = "studi.srv"

Start-Transcript -Path $LogPath

try {
    $Users = Import-Csv -Path $CsvPath -Delimiter ","

    foreach ($User in $Users) {
        $FullName = "$($User.Prenom) $($User.Nom)"
        $Login = $User.Login
        $UPN = "$Login@$DomainUPN"

        $ExistingUser = Get-ADUser -Filter "SamAccountName -eq '$Login'" -ErrorAction SilentlyContinue

        if ($ExistingUser) {
            Write-Host "Utilisateur déjà existant : $Login" -ForegroundColor Yellow
            continue
        }

        New-ADUser `
            -Name $FullName `
            -GivenName $User.Prenom `
            -Surname $User.Nom `
            -DisplayName $FullName `
            -SamAccountName $Login `
            -UserPrincipalName $UPN `
            -EmailAddress $User.Mail `
            -Department $User.Department `
            -Title $User.Title `
            -Path $User.OU `
            -AccountPassword (ConvertTo-SecureString $User.Password -AsPlainText -Force) `
            -ChangePasswordAtLogon $true `
            -Enabled $true

        Write-Host "Compte créé : $Login" -ForegroundColor Green
    }
}
catch {
    Write-Host "Erreur : $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Stop-Transcript
}
```

---

## 🔐 2.3 Créer un utilisateur manuellement

```powershell
Import-Module ActiveDirectory

New-ADUser `
    -Name "Jean Dupont" `
    -GivenName "Jean" `
    -Surname "Dupont" `
    -DisplayName "Jean Dupont" `
    -SamAccountName "jdupont" `
    -UserPrincipalName "jdupont@studi.srv" `
    -EmailAddress "jdupont@studi.srv" `
    -Department "RH" `
    -Title "Assistant RH" `
    -Path "OU=RH,OU=Utilisateurs,DC=studi,DC=srv" `
    -AccountPassword (ConvertTo-SecureString "P@ssw0rd123!" -AsPlainText -Force) `
    -ChangePasswordAtLogon $true `
    -Enabled $true
```

---

## 🧹 2.4 Désactiver les comptes inactifs depuis plus de 90 jours

Version prudente avec export préalable.

```powershell
Import-Module ActiveDirectory

$DaysInactive = 90
$ExportPath = "C:\Scripts\Exports\users_inactifs_$DaysInactive`j.csv"
$DryRun = $true

$InactiveUsers = Search-ADAccount `
    -UsersOnly `
    -AccountInactive `
    -TimeSpan "$DaysInactive.00:00:00" |
Where-Object {
    $_.Enabled -eq $true
}

$InactiveUsers |
Select-Object Name, SamAccountName, DistinguishedName, LastLogonDate |
Export-Csv -Path $ExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Export des comptes inactifs : $ExportPath" -ForegroundColor Cyan

foreach ($User in $InactiveUsers) {
    if ($DryRun) {
        Write-Host "[DRY-RUN] Désactivation prévue : $($User.SamAccountName)" -ForegroundColor Yellow
    }
    else {
        Disable-ADAccount -Identity $User.SamAccountName
        Write-Host "Compte désactivé : $($User.SamAccountName)" -ForegroundColor Green
    }
}
```

!!! info
    Passer `$DryRun = $false` seulement après validation de l’export CSV.

---

## 🚫 2.5 Déplacer les comptes désactivés dans une OU Quarantaine

```powershell
Import-Module ActiveDirectory

$TargetOU = "OU=Quarantaine,DC=studi,DC=srv"
$DryRun = $true

$DisabledUsers = Get-ADUser -Filter 'Enabled -eq $false' -Properties DistinguishedName

foreach ($User in $DisabledUsers) {
    if ($DryRun) {
        Write-Host "[DRY-RUN] Déplacement prévu : $($User.SamAccountName) vers $TargetOU" -ForegroundColor Yellow
    }
    else {
        Move-ADObject -Identity $User.DistinguishedName -TargetPath $TargetOU
        Write-Host "Compte déplacé : $($User.SamAccountName)" -ForegroundColor Green
    }
}
```

---

## 🔓 2.6 Déverrouiller un compte utilisateur

```powershell
Import-Module ActiveDirectory

$Login = "jdupont"

Unlock-ADAccount -Identity $Login

Write-Host "Compte déverrouillé : $Login" -ForegroundColor Green
```

---

## 🔍 2.7 Lister les comptes verrouillés

```powershell
Import-Module ActiveDirectory

Search-ADAccount -LockedOut |
Select-Object Name, SamAccountName, DistinguishedName
```

---

## 🔑 2.8 Réinitialiser le mot de passe d’un utilisateur

```powershell
Import-Module ActiveDirectory

$Login = "jdupont"
$NewPassword = Read-Host "Nouveau mot de passe" -AsSecureString

Set-ADAccountPassword `
    -Identity $Login `
    -NewPassword $NewPassword `
    -Reset

Set-ADUser -Identity $Login -ChangePasswordAtLogon $true

Write-Host "Mot de passe réinitialisé pour : $Login" -ForegroundColor Green
```

---

## 🧾 2.9 Forcer le changement de mot de passe à la prochaine connexion

```powershell
Import-Module ActiveDirectory

$Login = "jdupont"

Set-ADUser -Identity $Login -ChangePasswordAtLogon $true

Write-Host "Changement de mot de passe obligatoire activé pour : $Login" -ForegroundColor Green
```

---

## ⏳ 2.10 Lister les comptes dont le mot de passe n’expire jamais

```powershell
Import-Module ActiveDirectory

Get-ADUser -Filter * -Properties PasswordNeverExpires, Enabled |
Where-Object {
    $_.PasswordNeverExpires -eq $true -and $_.Enabled -eq $true
} |
Select-Object Name, SamAccountName, PasswordNeverExpires, Enabled |
Export-Csv "C:\Scripts\Exports\password_never_expires.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🛡️ 2.11 Lister les comptes avec délégation sensible désactivée

Utile pour repérer les comptes sensibles.

```powershell
Import-Module ActiveDirectory

Get-ADUser -Filter * -Properties AccountNotDelegated, Enabled |
Where-Object {
    $_.Enabled -eq $true
} |
Select-Object Name, SamAccountName, AccountNotDelegated |
Export-Csv "C:\Scripts\Exports\delegation_users.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧑‍💼 2.12 Mettre à jour les attributs utilisateurs depuis CSV

Fichier CSV attendu :

```csv
Login,Department,Title,Mail
jdupont,RH,Assistant RH,jdupont@studi.srv
cmartin,Comptabilite,Comptable,cmartin@studi.srv
```

Script :

```powershell
Import-Module ActiveDirectory

$CsvPath = "C:\Scripts\AD\Users\maj_attributs_users.csv"
$Users = Import-Csv -Path $CsvPath

foreach ($User in $Users) {
    $ADUser = Get-ADUser -Filter "SamAccountName -eq '$($User.Login)'" -ErrorAction SilentlyContinue

    if ($ADUser) {
        Set-ADUser `
            -Identity $User.Login `
            -Department $User.Department `
            -Title $User.Title `
            -EmailAddress $User.Mail

        Write-Host "Utilisateur mis à jour : $($User.Login)" -ForegroundColor Green
    }
    else {
        Write-Host "Utilisateur introuvable : $($User.Login)" -ForegroundColor Red
    }
}
```

---

# 👥 3. Active Directory : groupes

---

## 🧱 3.1 Créer un groupe AD

```powershell
Import-Module ActiveDirectory

New-ADGroup `
    -Name "GG_RH_Lecture" `
    -SamAccountName "GG_RH_Lecture" `
    -GroupScope Global `
    -GroupCategory Security `
    -Path "OU=Groupes,DC=studi,DC=srv" `
    -Description "Groupe global RH - accès lecture"

Write-Host "Groupe créé." -ForegroundColor Green
```

---

## 🏗️ 3.2 Créer plusieurs groupes depuis CSV

CSV attendu :

```csv
Name,Scope,Category,OU,Description
GG_RH_Lecture,Global,Security,"OU=Groupes,DC=studi,DC=srv",Accès lecture RH
GG_RH_Modification,Global,Security,"OU=Groupes,DC=studi,DC=srv",Accès modification RH
GG_IT_Admins,Global,Security,"OU=Groupes,DC=studi,DC=srv",Administrateurs IT
```

Script :

```powershell
Import-Module ActiveDirectory

$CsvPath = "C:\Scripts\AD\Groups\groupes.csv"
$Groups = Import-Csv -Path $CsvPath

foreach ($Group in $Groups) {
    $ExistingGroup = Get-ADGroup -Filter "SamAccountName -eq '$($Group.Name)'" -ErrorAction SilentlyContinue

    if ($ExistingGroup) {
        Write-Host "Groupe déjà existant : $($Group.Name)" -ForegroundColor Yellow
        continue
    }

    New-ADGroup `
        -Name $Group.Name `
        -SamAccountName $Group.Name `
        -GroupScope $Group.Scope `
        -GroupCategory $Group.Category `
        -Path $Group.OU `
        -Description $Group.Description

    Write-Host "Groupe créé : $($Group.Name)" -ForegroundColor Green
}
```

---

## ➕ 3.3 Ajouter des utilisateurs à un groupe depuis CSV

CSV attendu :

```csv
Login,GroupName
jdupont,GG_RH_Lecture
cmartin,GG_RH_Lecture
abernard,GG_IT_Admins
```

Script :

```powershell
Import-Module ActiveDirectory

$CsvPath = "C:\Scripts\AD\Groups\ajout_membres.csv"
$Rows = Import-Csv -Path $CsvPath

foreach ($Row in $Rows) {
    try {
        Add-ADGroupMember -Identity $Row.GroupName -Members $Row.Login
        Write-Host "$($Row.Login) ajouté à $($Row.GroupName)" -ForegroundColor Green
    }
    catch {
        Write-Host "Erreur pour $($Row.Login) -> $($Row.GroupName) : $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

---

## ➖ 3.4 Retirer un utilisateur d’un groupe

```powershell
Import-Module ActiveDirectory

$User = "jdupont"
$Group = "GG_RH_Lecture"

Remove-ADGroupMember -Identity $Group -Members $User -Confirm:$false

Write-Host "$User retiré du groupe $Group" -ForegroundColor Yellow
```

---

## 🧾 3.5 Exporter les membres d’un groupe

```powershell
Import-Module ActiveDirectory

$GroupName = "GG_IT_Admins"
$ExportPath = "C:\Scripts\Exports\membres_$GroupName.csv"

Get-ADGroupMember -Identity $GroupName -Recursive |
Select-Object Name, SamAccountName, ObjectClass |
Export-Csv -Path $ExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Export terminé : $ExportPath" -ForegroundColor Green
```

---

## 🛡️ 3.6 Auditer les groupes privilégiés

Groupes sensibles à surveiller :

- `Domain Admins`
- `Enterprise Admins`
- `Schema Admins`
- `Administrators`
- `Account Operators`
- `Server Operators`
- `Backup Operators`
- `DnsAdmins`
- `Group Policy Creator Owners`

```powershell
Import-Module ActiveDirectory

$PrivGroups = @(
    "Domain Admins",
    "Enterprise Admins",
    "Schema Admins",
    "Administrators",
    "Account Operators",
    "Server Operators",
    "Backup Operators",
    "DnsAdmins",
    "Group Policy Creator Owners"
)

$Results = foreach ($Group in $PrivGroups) {
    try {
        Get-ADGroupMember -Identity $Group -Recursive | ForEach-Object {
            [PSCustomObject]@{
                Group       = $Group
                Name        = $_.Name
                SamAccount  = $_.SamAccountName
                ObjectClass = $_.ObjectClass
            }
        }
    }
    catch {
        [PSCustomObject]@{
            Group       = $Group
            Name        = "ERREUR"
            SamAccount  = $_.Exception.Message
            ObjectClass = ""
        }
    }
}

$Results | Export-Csv "C:\Scripts\Exports\audit_groupes_privilegies.csv" -NoTypeInformation -Encoding UTF8

Write-Host "Audit terminé." -ForegroundColor Green
```

---

## 🔍 3.7 Lister tous les groupes d’un utilisateur

```powershell
Import-Module ActiveDirectory

$Login = "jdupont"

Get-ADPrincipalGroupMembership -Identity $Login |
Select-Object Name, GroupScope, GroupCategory |
Sort-Object Name
```

---

# 💻 4. Active Directory : ordinateurs

---

## 🔎 4.1 Lister les ordinateurs du domaine

```powershell
Import-Module ActiveDirectory

Get-ADComputer -Filter * -Properties OperatingSystem, LastLogonDate |
Select-Object Name, OperatingSystem, Enabled, LastLogonDate
```

---

## 🧾 4.2 Exporter les ordinateurs du domaine

```powershell
Import-Module ActiveDirectory

Get-ADComputer -Filter * -Properties OperatingSystem, OperatingSystemVersion, LastLogonDate, IPv4Address |
Select-Object `
    Name,
    DNSHostName,
    OperatingSystem,
    OperatingSystemVersion,
    IPv4Address,
    Enabled,
    LastLogonDate |
Export-Csv "C:\Scripts\Exports\ordinateurs_ad.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧹 4.3 Trouver les ordinateurs inactifs depuis 90 jours

```powershell
Import-Module ActiveDirectory

$DaysInactive = 90
$ExportPath = "C:\Scripts\Exports\computers_inactifs_$DaysInactive`j.csv"

$InactiveComputers = Search-ADAccount `
    -ComputersOnly `
    -AccountInactive `
    -TimeSpan "$DaysInactive.00:00:00"

$InactiveComputers |
Select-Object Name, SamAccountName, DistinguishedName, LastLogonDate |
Export-Csv -Path $ExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Export terminé : $ExportPath" -ForegroundColor Green
```

---

## 🚫 4.4 Désactiver les ordinateurs inactifs

```powershell
Import-Module ActiveDirectory

$DaysInactive = 120
$DryRun = $true

$InactiveComputers = Search-ADAccount `
    -ComputersOnly `
    -AccountInactive `
    -TimeSpan "$DaysInactive.00:00:00" |
Where-Object {
    $_.Enabled -eq $true
}

foreach ($Computer in $InactiveComputers) {
    if ($DryRun) {
        Write-Host "[DRY-RUN] Désactivation prévue : $($Computer.Name)" -ForegroundColor Yellow
    }
    else {
        Disable-ADAccount -Identity $Computer.SamAccountName
        Write-Host "Ordinateur désactivé : $($Computer.Name)" -ForegroundColor Green
    }
}
```

---

## 📦 4.5 Déplacer un ordinateur dans une OU

```powershell
Import-Module ActiveDirectory

$ComputerName = "PC-CLIENT01"
$TargetOU = "OU=PC_Fixes,OU=Ordinateurs,DC=studi,DC=srv"

$Computer = Get-ADComputer -Identity $ComputerName

Move-ADObject -Identity $Computer.DistinguishedName -TargetPath $TargetOU

Write-Host "Ordinateur déplacé : $ComputerName" -ForegroundColor Green
```

---

# ⚙️ 5. GPO : gestion et audit

Les GPO permettent d’appliquer des configurations aux utilisateurs et ordinateurs du domaine.

Exemples :

- stratégie de mot de passe ;
- restrictions poste client ;
- lecteurs réseau ;
- imprimantes ;
- pare-feu Windows ;
- scripts de logon ;
- paramètres de sécurité ;
- configuration navigateur ;
- déploiement logiciel ;
- redirection de dossiers.

---

## 🧰 5.1 Prérequis GPO PowerShell

Importer le module :

```powershell
Import-Module GroupPolicy
```

Lister les commandes disponibles :

```powershell
Get-Command -Module GroupPolicy
```

Lister toutes les GPO :

```powershell
Get-GPO -All
```

---

## 🧾 5.2 Exporter la liste des GPO

```powershell
Import-Module GroupPolicy

Get-GPO -All |
Select-Object DisplayName, Id, Owner, CreationTime, ModificationTime, GpoStatus |
Export-Csv "C:\Scripts\Exports\liste_gpo.csv" -NoTypeInformation -Encoding UTF8

Write-Host "Export terminé." -ForegroundColor Green
```

---

## 💾 5.3 Sauvegarder toutes les GPO

```powershell
Import-Module GroupPolicy

$BackupRoot = "C:\Scripts\GPO\Backup"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupPath = "$BackupRoot\GPO_Backup_$Date"

if (!(Test-Path $BackupPath)) {
    New-Item -Path $BackupPath -ItemType Directory -Force | Out-Null
}

Backup-GPO -All -Path $BackupPath

Write-Host "Sauvegarde des GPO terminée : $BackupPath" -ForegroundColor Green
```

---

## 📄 5.4 Générer un rapport HTML pour toutes les GPO

```powershell
Import-Module GroupPolicy

$ReportDir = "C:\Scripts\GPO\Reports"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

if (!(Test-Path $ReportDir)) {
    New-Item -Path $ReportDir -ItemType Directory -Force | Out-Null
}

Get-GPO -All | ForEach-Object {
    $SafeName = $_.DisplayName -replace '[\\/:*?"<>|]', '_'
    $ReportPath = "$ReportDir\$SafeName`_$Date.html"

    Get-GPOReport `
        -Guid $_.Id `
        -ReportType Html `
        -Path $ReportPath

    Write-Host "Rapport généré : $ReportPath" -ForegroundColor Green
}
```

---

## 📄 5.5 Générer un rapport XML pour analyse

```powershell
Import-Module GroupPolicy

$ReportPath = "C:\Scripts\GPO\Reports\rapport_gpo_complet.xml"

Get-GPOReport -All -ReportType Xml -Path $ReportPath

Write-Host "Rapport XML généré : $ReportPath" -ForegroundColor Green
```

---

## 🏗️ 5.6 Créer une nouvelle GPO

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"

New-GPO -Name $GpoName -Comment "GPO de sécurisation des postes clients"

Write-Host "GPO créée : $GpoName" -ForegroundColor Green
```

---

## 🔗 5.7 Lier une GPO à une OU

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"
$TargetOU = "OU=PC_Fixes,OU=Ordinateurs,DC=studi,DC=srv"

New-GPLink `
    -Name $GpoName `
    -Target $TargetOU `
    -LinkEnabled Yes

Write-Host "GPO liée à : $TargetOU" -ForegroundColor Green
```

---

## 🚫 5.8 Désactiver le lien d’une GPO

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"
$TargetOU = "OU=PC_Fixes,OU=Ordinateurs,DC=studi,DC=srv"

Set-GPLink `
    -Name $GpoName `
    -Target $TargetOU `
    -LinkEnabled No

Write-Host "Lien GPO désactivé." -ForegroundColor Yellow
```

---

## 🔒 5.9 Activer l’Enforced sur un lien GPO

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"
$TargetOU = "OU=PC_Fixes,OU=Ordinateurs,DC=studi,DC=srv"

Set-GPLink `
    -Name $GpoName `
    -Target $TargetOU `
    -Enforced Yes

Write-Host "GPO forcée sur l’OU." -ForegroundColor Green
```

---

## 🧪 5.10 Forcer un gpupdate sur une OU complète

```powershell
Import-Module ActiveDirectory
Import-Module GroupPolicy

$SearchBase = "OU=PC_Portables,OU=Ordinateurs,DC=studi,DC=srv"

$Computers = Get-ADComputer -Filter * -SearchBase $SearchBase

foreach ($Computer in $Computers) {
    try {
        Write-Host "Envoi gpupdate vers $($Computer.Name)..." -ForegroundColor Cyan

        Invoke-GPUpdate `
            -Computer $Computer.Name `
            -Target Computer `
            -Force `
            -RandomDelayInMinutes 0
    }
    catch {
        Write-Host "Erreur sur $($Computer.Name) : $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

---

## 🧪 5.11 Forcer gpupdate localement

```powershell
gpupdate /force
```

---

## 🧾 5.12 Générer un rapport gpresult local

```powershell
gpresult /h C:\Scripts\Exports\gpresult.html
```

---

## 🖥️ 5.13 Générer un rapport gpresult distant

```powershell
$Computer = "PC-CLIENT01"
$User = "STUDI\jdupont"
$Output = "C:\Scripts\Exports\gpresult_$Computer.html"

gpresult /S $Computer /USER $User /H $Output

Write-Host "Rapport généré : $Output" -ForegroundColor Green
```

---

## 🔎 5.14 Voir les GPO appliquées à un poste

```powershell
gpresult /r
```

Pour la partie ordinateur :

```powershell
gpresult /scope computer /r
```

Pour la partie utilisateur :

```powershell
gpresult /scope user /r
```

---

## 🧼 5.15 Trouver les GPO non modifiées depuis longtemps

```powershell
Import-Module GroupPolicy

$LimitDate = (Get-Date).AddMonths(-12)

Get-GPO -All |
Where-Object {
    $_.ModificationTime -lt $LimitDate
} |
Select-Object DisplayName, Owner, CreationTime, ModificationTime, GpoStatus |
Export-Csv "C:\Scripts\Exports\gpo_non_modifiees_12_mois.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧨 5.16 Trouver les GPO désactivées

```powershell
Import-Module GroupPolicy

Get-GPO -All |
Where-Object {
    $_.GpoStatus -ne "AllSettingsEnabled"
} |
Select-Object DisplayName, GpoStatus, CreationTime, ModificationTime |
Export-Csv "C:\Scripts\Exports\gpo_desactivees.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔐 5.17 Lister les permissions d’une GPO

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"

Get-GPPermission -Name $GpoName -All |
Select-Object Trustee, TrusteeType, Permission |
Format-Table -AutoSize
```

---

## 🔐 5.18 Donner le droit d’appliquer une GPO à un groupe

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"
$Group = "GG_Postes_Clients"

Set-GPPermission `
    -Name $GpoName `
    -TargetName $Group `
    -TargetType Group `
    -PermissionLevel GpoApply

Write-Host "Permission appliquée." -ForegroundColor Green
```

---

## 🚫 5.19 Retirer le droit d’appliquer une GPO

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_SECURITE_POSTES_CLIENTS"
$Group = "GG_Postes_Clients"

Set-GPPermission `
    -Name $GpoName `
    -TargetName $Group `
    -TargetType Group `
    -PermissionLevel None

Write-Host "Permission retirée." -ForegroundColor Yellow
```

---

## ⚙️ 5.20 Configurer une clé registre via GPO

Exemple : désactiver le gestionnaire des tâches pour les utilisateurs ciblés.

```powershell
Import-Module GroupPolicy

$GpoName = "GPO_RESTRICTION_UTILISATEURS"

Set-GPRegistryValue `
    -Name $GpoName `
    -Key "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" `
    -ValueName "DisableTaskMgr" `
    -Type DWord `
    -Value 1

Write-Host "Paramètre registre ajouté à la GPO." -ForegroundColor Green
```

---

## 🔄 5.21 Restaurer une GPO depuis une sauvegarde

```powershell
Import-Module GroupPolicy

$BackupPath = "C:\Scripts\GPO\Backup\GPO_Backup_2026-04-26_10-30-00"
$GpoName = "GPO_SECURITE_POSTES_CLIENTS"

Restore-GPO `
    -Name $GpoName `
    -Path $BackupPath

Write-Host "GPO restaurée : $GpoName" -ForegroundColor Green
```

---

# 🛡️ 6. Scripts d’audit cyber Active Directory

---

## 🔎 6.1 Lister les comptes activés sans date de connexion récente

```powershell
Import-Module ActiveDirectory

Get-ADUser -Filter 'Enabled -eq $true' -Properties LastLogonDate, PasswordLastSet |
Select-Object Name, SamAccountName, LastLogonDate, PasswordLastSet |
Sort-Object LastLogonDate |
Export-Csv "C:\Scripts\Exports\audit_users_lastlogon.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔓 6.2 Lister les comptes sans mot de passe requis

```powershell
Import-Module ActiveDirectory

Get-ADUser -Filter * -Properties PasswordNotRequired, Enabled |
Where-Object {
    $_.PasswordNotRequired -eq $true
} |
Select-Object Name, SamAccountName, Enabled, PasswordNotRequired |
Export-Csv "C:\Scripts\Exports\password_not_required.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧨 6.3 Lister les comptes administrateurs activés

```powershell
Import-Module ActiveDirectory

$AdminGroups = @(
    "Domain Admins",
    "Enterprise Admins",
    "Administrators",
    "Schema Admins"
)

$Results = foreach ($Group in $AdminGroups) {
    Get-ADGroupMember -Identity $Group -Recursive | ForEach-Object {
        if ($_.ObjectClass -eq "user") {
            $User = Get-ADUser -Identity $_.SamAccountName -Properties Enabled, LastLogonDate
            [PSCustomObject]@{
                Group         = $Group
                Name          = $User.Name
                SamAccount    = $User.SamAccountName
                Enabled       = $User.Enabled
                LastLogonDate = $User.LastLogonDate
            }
        }
    }
}

$Results |
Export-Csv "C:\Scripts\Exports\admins_actifs.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧹 6.4 Lister les comptes expirés

```powershell
Import-Module ActiveDirectory

Search-ADAccount -AccountExpired -UsersOnly |
Select-Object Name, SamAccountName, AccountExpirationDate, Enabled |
Export-Csv "C:\Scripts\Exports\comptes_expires.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔒 6.5 Lister les comptes désactivés

```powershell
Import-Module ActiveDirectory

Search-ADAccount -AccountDisabled -UsersOnly |
Select-Object Name, SamAccountName, DistinguishedName |
Export-Csv "C:\Scripts\Exports\comptes_desactives.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔐 6.6 Lister les comptes avec mot de passe expiré

```powershell
Import-Module ActiveDirectory

Search-ADAccount -PasswordExpired -UsersOnly |
Select-Object Name, SamAccountName, Enabled |
Export-Csv "C:\Scripts\Exports\password_expired.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧪 6.7 Audit rapide global AD

```powershell
Import-Module ActiveDirectory

$ExportDir = "C:\Scripts\Exports\Audit_AD_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"

New-Item -Path $ExportDir -ItemType Directory -Force | Out-Null

Get-ADUser -Filter * -Properties Enabled, LastLogonDate, PasswordNeverExpires, PasswordNotRequired, PasswordLastSet |
Select-Object Name, SamAccountName, Enabled, LastLogonDate, PasswordNeverExpires, PasswordNotRequired, PasswordLastSet |
Export-Csv "$ExportDir\users_audit.csv" -NoTypeInformation -Encoding UTF8

Get-ADComputer -Filter * -Properties Enabled, OperatingSystem, LastLogonDate |
Select-Object Name, Enabled, OperatingSystem, LastLogonDate |
Export-Csv "$ExportDir\computers_audit.csv" -NoTypeInformation -Encoding UTF8

Get-ADGroup -Filter * -Properties Description |
Select-Object Name, GroupScope, GroupCategory, Description |
Export-Csv "$ExportDir\groups_audit.csv" -NoTypeInformation -Encoding UTF8

Write-Host "Audit AD terminé : $ExportDir" -ForegroundColor Green
```

---

# 🖥️ 7. Administration distante Windows

---

## 🔌 7.1 Tester la connectivité d’une liste de serveurs

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01", "SRV-WEB01")

foreach ($Server in $Servers) {
    if (Test-Connection -ComputerName $Server -Count 2 -Quiet) {
        Write-Host "$Server répond au ping" -ForegroundColor Green
    }
    else {
        Write-Host "$Server ne répond pas" -ForegroundColor Red
    }
}
```

---

## ⚙️ 7.2 Vérifier l’état d’un service sur plusieurs serveurs

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01", "SRV-WEB01")
$ServiceName = "Spooler"

Get-Service -Name $ServiceName -ComputerName $Servers |
Select-Object MachineName, Status, DisplayName
```

---

## 🔄 7.3 Redémarrer un service à distance (Méthode Moderne WinRM)

"WinRM vs RPC"
    Aujourd'hui, de nombreuses commandes classiques comme `Get-Service -ComputerName` échouent car elles utilisent le vieux protocole RPC (bloqué par les pare-feux).
    La bonne pratique est d'utiliser `Invoke-Command` qui s'appuie sur **WinRM (Port HTTP 5985)**.

```powershell
$Servers = @("SRV-FILE01", "SRV-WEB01")
$ServiceName = "Spooler"

Invoke-Command -ComputerName $Servers -ScriptBlock {
    Restart-Service -Name $using:ServiceName -Force
    Write-Output "Service $using:ServiceName redémarré sur $env:COMPUTERNAME"
}
```

---

## 🧾 7.4 Lister les services arrêtés en démarrage automatique

```powershell
Get-CimInstance Win32_Service |
Where-Object {
    $_.StartMode -eq "Auto" -and $_.State -ne "Running"
} |
Select-Object Name, DisplayName, State, StartMode
```

Version distante :

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01")

foreach ($Server in $Servers) {
    Get-CimInstance Win32_Service -ComputerName $Server |
    Where-Object {
        $_.StartMode -eq "Auto" -and $_.State -ne "Running"
    } |
    Select-Object @{Name="Server";Expression={$Server}}, Name, DisplayName, State, StartMode
}
```

---

## 💽 7.5 Vérifier l’espace disque sur plusieurs serveurs

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01", "SRV-WEB01")

foreach ($Server in $Servers) {
    Get-CimInstance Win32_LogicalDisk -ComputerName $Server -Filter "DriveType=3" |
    Select-Object `
        @{Name="Server";Expression={$Server}},
        DeviceID,
        @{Name="SizeGB";Expression={[math]::Round($_.Size / 1GB, 2)}},
        @{Name="FreeGB";Expression={[math]::Round($_.FreeSpace / 1GB, 2)}},
        @{Name="FreePercent";Expression={[math]::Round(($_.FreeSpace / $_.Size) * 100, 2)}}
}
```

---

## 🚨 7.6 Alerter si espace disque inférieur à 15 %

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01", "SRV-WEB01")
$Threshold = 15

$Results = foreach ($Server in $Servers) {
    Get-CimInstance Win32_LogicalDisk -ComputerName $Server -Filter "DriveType=3" |
    ForEach-Object {
        $FreePercent = [math]::Round(($_.FreeSpace / $_.Size) * 100, 2)

        if ($FreePercent -lt $Threshold) {
            [PSCustomObject]@{
                Server      = $Server
                Drive       = $_.DeviceID
                FreePercent = $FreePercent
                FreeGB      = [math]::Round($_.FreeSpace / 1GB, 2)
                SizeGB      = [math]::Round($_.Size / 1GB, 2)
            }
        }
    }
}

$Results | Export-Csv "C:\Scripts\Exports\alertes_disque.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧾 7.7 Exporter les logiciels installés

```powershell
$Computer = "SRV-WEB01"

Get-CimInstance Win32_Product -ComputerName $Computer |
Select-Object Name, Version, Vendor |
Export-Csv "C:\Scripts\Exports\logiciels_$Computer.csv" -NoTypeInformation -Encoding UTF8
```

!!! warning
    `Win32_Product` peut être lent et provoquer des vérifications MSI. À utiliser avec prudence en production.

Alternative registre locale :

```powershell
$Paths = @(
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

Get-ItemProperty $Paths |
Where-Object { $_.DisplayName } |
Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
Sort-Object DisplayName
```

---

# 🧾 8. Logs et événements Windows

---

## 🔍 8.1 Lire les derniers événements système critiques

```powershell
Get-WinEvent -LogName System -MaxEvents 100 |
Where-Object {
    $_.LevelDisplayName -in @("Critical", "Error")
} |
Select-Object TimeCreated, ProviderName, Id, LevelDisplayName, Message
```

---

## 🚨 8.2 Exporter les erreurs des dernières 24 heures

```powershell
$StartTime = (Get-Date).AddHours(-24)

Get-WinEvent -FilterHashtable @{
    LogName = "System"
    Level = 1,2
    StartTime = $StartTime
} |
Select-Object TimeCreated, ProviderName, Id, LevelDisplayName, Message |
Export-Csv "C:\Scripts\Exports\erreurs_system_24h.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔐 8.3 Voir les connexions réussies

ID événement courant :

```text
4624 = connexion réussie
4625 = échec de connexion
```

Script :

```powershell
Get-WinEvent -FilterHashtable @{
    LogName = "Security"
    Id = 4624
    StartTime = (Get-Date).AddHours(-12)
} |
Select-Object TimeCreated, Id, ProviderName, Message |
Export-Csv "C:\Scripts\Exports\logons_success_12h.csv" -NoTypeInformation -Encoding UTF8
```

---

## ❌ 8.4 Voir les échecs de connexion

```powershell
Get-WinEvent -FilterHashtable @{
    LogName = "Security"
    Id = 4625
    StartTime = (Get-Date).AddHours(-12)
} |
Select-Object TimeCreated, Id, ProviderName, Message |
Export-Csv "C:\Scripts\Exports\logons_failed_12h.csv" -NoTypeInformation -Encoding UTF8
```

---

# 💾 9. Sauvegardes et maintenance fichiers

---

## 📦 9.1 Sauvegarde ZIP avec rotation

```powershell
$Source = "C:\Data\Partage_RH"
$BackupDir = "D:\Backups\RH"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$ZipName = "$BackupDir\Backup_RH_$Date.zip"
$RetentionDays = 7

if (!(Test-Path $BackupDir)) {
    New-Item -Path $BackupDir -ItemType Directory -Force | Out-Null
}

Compress-Archive -Path "$Source\*" -DestinationPath $ZipName -Force

Get-ChildItem $BackupDir -Filter *.zip |
Where-Object {
    $_.CreationTime -lt (Get-Date).AddDays(-$RetentionDays)
} |
Remove-Item -Force

Write-Host "Sauvegarde terminée : $ZipName" -ForegroundColor Green
```

---

## 🔁 9.2 Sauvegarde miroir avec Robocopy

```powershell
$Source = "C:\Data"
$Destination = "D:\Backup\Data"
$LogFile = "C:\Scripts\Logs\robocopy_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').log"

robocopy $Source $Destination /MIR /R:3 /W:5 /LOG:$LogFile /TEE

Write-Host "Sauvegarde Robocopy terminée. Log : $LogFile" -ForegroundColor Green
```

!!! warning
    L’option `/MIR` rend la destination identique à la source. Si un fichier est supprimé dans la source, il sera supprimé dans la destination.

---

## 🧹 9.3 Supprimer les logs de plus de 30 jours

```powershell
$LogPath = "C:\inetpub\logs\LogFiles"
$RetentionDays = 30

Get-ChildItem -Path $LogPath -Recurse -Filter *.log |
Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays)
} |
Remove-Item -Force

Write-Host "Nettoyage terminé." -ForegroundColor Green
```

---

## 🔍 9.4 Trouver les gros fichiers

```powershell
$Path = "C:\"
$MinSizeGB = 1

Get-ChildItem -Path $Path -Recurse -File -ErrorAction SilentlyContinue |
Where-Object {
    $_.Length -gt ($MinSizeGB * 1GB)
} |
Select-Object FullName, @{Name="SizeGB";Expression={[math]::Round($_.Length / 1GB, 2)}} |
Sort-Object SizeGB -Descending |
Export-Csv "C:\Scripts\Exports\gros_fichiers.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔐 9.5 Exporter les permissions NTFS d’un dossier

```powershell
$Path = "D:\Partages"
$ExportPath = "C:\Scripts\Exports\permissions_ntfs.csv"

Get-ChildItem -Path $Path -Directory |
ForEach-Object {
    $Folder = $_.FullName
    Get-Acl $Folder | ForEach-Object {
        $_.Access | ForEach-Object {
            [PSCustomObject]@{
                Folder       = $Folder
                Identity     = $_.IdentityReference
                Rights       = $_.FileSystemRights
                AccessType   = $_.AccessControlType
                IsInherited  = $_.IsInherited
            }
        }
    }
} |
Export-Csv $ExportPath -NoTypeInformation -Encoding UTF8

Write-Host "Export terminé : $ExportPath" -ForegroundColor Green
```

---

# 🧱 10. Partages réseau SMB

---

## 🔎 10.1 Lister les partages locaux

```powershell
Get-SmbShare |
Select-Object Name, Path, Description
```

---

## 🔐 10.2 Lister les droits de partage SMB

```powershell
Get-SmbShare |
ForEach-Object {
    $ShareName = $_.Name

    Get-SmbShareAccess -Name $ShareName |
    Select-Object `
        @{Name="Share";Expression={$ShareName}},
        AccountName,
        AccessControlType,
        AccessRight
}
```

---

## 📁 10.3 Créer un partage réseau

```powershell
$ShareName = "RH"
$Path = "D:\Partages\RH"

if (!(Test-Path $Path)) {
    New-Item -Path $Path -ItemType Directory -Force | Out-Null
}

New-SmbShare `
    -Name $ShareName `
    -Path $Path `
    -FullAccess "STUDI\GG_IT_Admins" `
    -ChangeAccess "STUDI\GG_RH_Modification" `
    -ReadAccess "STUDI\GG_RH_Lecture"

Write-Host "Partage créé : \\$env:COMPUTERNAME\$ShareName" -ForegroundColor Green
```

---

# 🔥 11. Pare-feu Windows et sécurité locale

---

## 🔎 11.1 Voir l’état des profils pare-feu

```powershell
Get-NetFirewallProfile |
Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction
```

---

## ✅ 11.2 Activer le pare-feu Windows

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
```

---

## 🚪 11.3 Créer une règle firewall entrante

Exemple : autoriser RDP uniquement depuis un sous-réseau d’administration.

```powershell
New-NetFirewallRule `
    -DisplayName "Autoriser RDP depuis VLAN Admin" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3389 `
    -RemoteAddress 192.168.10.0/24 `
    -Action Allow
```

---

## 🔎 11.4 Lister les règles firewall actives

```powershell
Get-NetFirewallRule |
Where-Object {
    $_.Enabled -eq "True"
} |
Select-Object DisplayName, Direction, Action, Profile
```

---

## 🛡️ 11.5 Vérifier l’état de Microsoft Defender

```powershell
Get-MpComputerStatus |
Select-Object AMServiceEnabled, AntivirusEnabled, RealTimeProtectionEnabled, AntispywareEnabled, NISEnabled
```

---

# 🧪 12. Réseau : scripts PowerShell utiles

---

## 🌐 12.1 Afficher la configuration IP complète

```powershell
Get-NetIPConfiguration
```

---

## 🔎 12.2 Tester un port TCP

```powershell
Test-NetConnection -ComputerName "srv-web01" -Port 443
```

---

## 📡 12.3 Scanner une liste de ports sur un serveur

```powershell
$Computer = "srv-web01"
$Ports = @(22, 80, 443, 445, 3389)

foreach ($Port in $Ports) {
    $Result = Test-NetConnection -ComputerName $Computer -Port $Port -WarningAction SilentlyContinue

    [PSCustomObject]@{
        Computer = $Computer
        Port     = $Port
        Open     = $Result.TcpTestSucceeded
    }
}
```

---

## 🧾 12.4 Exporter les connexions réseau établies

```powershell
Get-NetTCPConnection |
Where-Object {
    $_.State -eq "Established"
} |
Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess |
Export-Csv "C:\Scripts\Exports\connexions_tcp.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🔎 12.5 Résolution DNS en masse

CSV attendu :

```csv
Name
google.com
microsoft.com
srv-ad01.studi.srv
```

Script :

```powershell
$CsvPath = "C:\Scripts\DNS\noms_dns.csv"
$Names = Import-Csv $CsvPath

foreach ($Item in $Names) {
    try {
        Resolve-DnsName $Item.Name |
        Select-Object Name, Type, IPAddress
    }
    catch {
        Write-Host "Erreur DNS pour $($Item.Name)" -ForegroundColor Red
    }
}
```

---

# 📬 13. Rapports HTML

---

## 📊 13.1 Générer un rapport HTML simple d’espace disque

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01", "SRV-WEB01")
$ReportPath = "C:\Scripts\Exports\rapport_disques.html"

$Data = foreach ($Server in $Servers) {
    Get-CimInstance Win32_LogicalDisk -ComputerName $Server -Filter "DriveType=3" |
    Select-Object `
        @{Name="Serveur";Expression={$Server}},
        DeviceID,
        @{Name="TailleGB";Expression={[math]::Round($_.Size / 1GB, 2)}},
        @{Name="LibreGB";Expression={[math]::Round($_.FreeSpace / 1GB, 2)}},
        @{Name="LibrePourcent";Expression={[math]::Round(($_.FreeSpace / $_.Size) * 100, 2)}}
}

$Html = $Data |
ConvertTo-Html `
    -Title "Rapport espace disque" `
    -PreContent "<h1>Rapport espace disque</h1><p>Généré le $(Get-Date)</p>"

$Html | Out-File $ReportPath -Encoding UTF8

Write-Host "Rapport généré : $ReportPath" -ForegroundColor Green
```

---

# 🐧 14. Automatisation Linux Bash

Même si l’environnement Windows est central en TSSR, savoir automatiser sous Linux reste indispensable.

---

## 🧾 14.1 Structure de base d’un script Bash

```bash
#!/bin/bash

set -e

echo "Début du script"

# Code ici

echo "Fin du script"
```

---

## 💾 14.2 Backup MySQL / MariaDB avec rotation

```bash
#!/bin/bash

DB_USER="root"
DB_PASS="MonMotDePasse"
DB_NAME="site_web_db"
DEST="/var/backups/mysql"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
RETENTION=30

mkdir -p "$DEST"

mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$DEST/${DB_NAME}_${DATE}.sql.gz"

find "$DEST" -type f -name "*.gz" -mtime +"$RETENTION" -delete

echo "Backup MySQL terminé : $DEST/${DB_NAME}_${DATE}.sql.gz"
```

---

## 👤 14.3 Création d’utilisateurs Linux depuis fichier texte

Fichier `users.txt` :

```text
jdupont
cmartin
abernard
```

Script :

```bash
#!/bin/bash

USER_LIST="users.txt"

while IFS= read -r username; do
    if [ -n "$username" ]; then
        if id "$username" &>/dev/null; then
            echo "Utilisateur déjà existant : $username"
        else
            useradd -m -s /bin/bash "$username"
            echo "Utilisateur créé : $username"
        fi
    fi
done < "$USER_LIST"
```

---

## 🧹 14.4 Supprimer les logs Linux de plus de 30 jours

```bash
#!/bin/bash

LOG_DIR="/var/log"
RETENTION=30

find "$LOG_DIR" -type f -name "*.log" -mtime +"$RETENTION" -delete

echo "Nettoyage des logs terminé."
```

---

## 💽 14.5 Vérifier l’espace disque Linux

```bash
#!/bin/bash

df -h
```

Version avec alerte simple :

```bash
#!/bin/bash

THRESHOLD=80

df -hP | awk 'NR>1 {print $5 " " $6}' | while read output; do
    usage=$(echo "$output" | awk '{print $1}' | sed 's/%//')
    partition=$(echo "$output" | awk '{print $2}')

    if [ "$usage" -ge "$THRESHOLD" ]; then
        echo "ALERTE : $partition utilisé à $usage%"
    fi
done
```

---

# 🧠 15. Planification des scripts

---

## ⏰ 15.1 Planifier un script PowerShell avec le Planificateur de tâches

Commande à exécuter :

```powershell
powershell.exe -ExecutionPolicy Bypass -File "C:\Scripts\AD\Audit\audit_ad.ps1"
```

---

## ⏰ 15.2 Créer une tâche planifiée en PowerShell

```powershell
$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File C:\Scripts\System\backup.ps1"

$Trigger = New-ScheduledTaskTrigger `
    -Daily `
    -At 02:00

$Principal = New-ScheduledTaskPrincipal `
    -UserId "SYSTEM" `
    -RunLevel Highest

Register-ScheduledTask `
    -TaskName "Backup quotidien" `
    -Action $Action `
    -Trigger $Trigger `
    -Principal $Principal `
    -Description "Sauvegarde quotidienne automatisée"
```

---

## 🐧 15.3 Planifier un script Bash avec cron

Éditer la crontab :

```bash
crontab -e
```

Exemple : exécution tous les jours à 2h00.

```bash
0 2 * * * /opt/scripts/backup_mysql.sh
```

---

# 🧾 16. Fichiers CSV utiles

---

## 👤 16.1 CSV utilisateurs AD

```csv
Prenom,Nom,Login,Password,OU,Department,Title,Mail
Jean,Dupont,jdupont,P@ssw0rd123!,"OU=RH,OU=Utilisateurs,DC=studi,DC=srv",RH,Assistant RH,jdupont@studi.srv
```

---

## 👥 16.2 CSV groupes AD

```csv
Name,Scope,Category,OU,Description
GG_RH_Lecture,Global,Security,"OU=Groupes,DC=studi,DC=srv",Accès lecture RH
```

---

## ➕ 16.3 CSV ajout membres groupes

```csv
Login,GroupName
jdupont,GG_RH_Lecture
cmartin,GG_RH_Lecture
```

---

## 💻 16.4 CSV serveurs

```csv
Name,Role
SRV-AD01,Domain Controller
SRV-FILE01,File Server
SRV-WEB01,Web Server
```

---

# 🛠️ 17. Commandes PowerShell à connaître par cœur

| Commande | Usage |
| :--- | :--- |
| `Get-Help` | Aide sur une commande |
| `Get-Command` | Trouver une commande |
| `Get-Member` | Voir les propriétés/méthodes |
| `Get-Process` | Processus |
| `Get-Service` | Services |
| `Get-EventLog` | Anciens journaux |
| `Get-WinEvent` | Journaux modernes |
| `Get-ADUser` | Utilisateurs AD |
| `Get-ADComputer` | Ordinateurs AD |
| `Get-ADGroup` | Groupes AD |
| `Get-GPO` | Stratégies de groupe |
| `Where-Object` | Filtrer |
| `Select-Object` | Sélectionner des propriétés |
| `Sort-Object` | Trier |
| `Export-Csv` | Export CSV |
| `Import-Csv` | Import CSV |
| `ForEach-Object` | Boucle pipeline |
| `Test-NetConnection` | Test réseau |
| `Invoke-Command` | Exécution distante |
| `Start-Transcript` | Journalisation de session |

---

# 🧠 18. Astuces PowerShell importantes

---

## 🔎 18.1 Obtenir de l’aide

```powershell
Get-Help Get-ADUser -Full
```

---

## 🔎 18.2 Voir les exemples d’une commande

```powershell
Get-Help Get-ADUser -Examples
```

---

## 🧪 18.3 Tester sans modifier

Quand disponible :

```powershell
Remove-Item C:\Temp\test.txt -WhatIf
```

---

## 🧾 18.4 Exporter proprement en CSV

```powershell
Get-Service |
Select-Object Name, Status, DisplayName |
Export-Csv "C:\Scripts\Exports\services.csv" -NoTypeInformation -Encoding UTF8
```

---

## 🧹 18.5 Filtrer proprement

```powershell
Get-Service |
Where-Object {
    $_.Status -eq "Running"
}
```

---

## 🔁 18.6 Boucle foreach classique

```powershell
$Servers = @("SRV-AD01", "SRV-FILE01")

foreach ($Server in $Servers) {
    Write-Host "Traitement de $Server"
}
```

---

## 🧯 18.7 Gestion d’erreurs simple

```powershell
try {
    Get-ADUser -Identity "jdupont"
}
catch {
    Write-Host "Erreur : $($_.Exception.Message)" -ForegroundColor Red
}
```

---

# ✅ 19. Checklist avant d’exécuter un script AD/GPO

- [ ] Le script a été relu ?
- [ ] Le périmètre est limité ?
- [ ] Le `SearchBase` est correct ?
- [ ] Un export préalable est prévu ?
- [ ] Le mode dry-run existe ?
- [ ] Le compte utilisé a les bons droits ?
- [ ] Le script est testé en lab ?
- [ ] Les logs sont activés ?
- [ ] La sauvegarde GPO est faite ?
- [ ] Les actions destructives utilisent `-WhatIf` ou confirmation ?
- [ ] La date, l’auteur et l’objectif sont documentés ?

---

# 🧠 20. Règles d’or de l’automatisation AdminSys

1. **Toujours comprendre avant d’exécuter.**
2. **Toujours tester sur un petit périmètre.**
3. **Toujours exporter avant de modifier.**
4. **Toujours journaliser les actions importantes.**
5. **Ne jamais mettre de mot de passe en clair en production.**
6. **Limiter les droits du compte utilisé.**
7. **Éviter les scripts destructifs sans garde-fou.**
8. **Préférer les groupes AD aux droits utilisateurs directs.**
9. **Documenter les scripts dans le wiki.**
10. **Versionner les scripts avec Git.**
11. **Utiliser des noms explicites.**
12. **Prévoir le rollback quand c’est possible.**
13. **Planifier les scripts hors horaires critiques.**
14. **Relire les variables avant exécution.**
15. **Un script qui touche AD ou GPO peut impacter tout le domaine.**

---

# 📌 21. Mini-glossaire PowerShell

| Terme | Définition |
| :--- | :--- |
| **Cmdlet** | Commande PowerShell, souvent sous forme Verbe-Nom |
| **Pipeline** | Transmission d’objets entre commandes avec `|` |
| **Objet** | Élément structuré avec propriétés et méthodes |
| **Propriété** | Information portée par un objet |
| **Méthode** | Action possible sur un objet |
| **Module** | Ensemble de commandes PowerShell |
| **CSV** | Fichier de données tabulaires |
| **Transcript** | Journal complet d’une session PowerShell |
| **WhatIf** | Simulation d’une action sans modification |
| **Credential** | Identifiants utilisés pour une action |

---

# 🧭 Conclusion

PowerShell est un outil central pour un administrateur système Windows.

Il permet de gérer :

```text
Active Directory,
les utilisateurs,
les groupes,
les ordinateurs,
les GPO,
les services,
les fichiers,
les partages,
les journaux,
la sécurité,
les sauvegardes,
et l’administration distante.
```

La logique à retenir :

```text
Lire -> Filtrer -> Vérifier -> Exporter -> Modifier -> Journaliser
```

Avant toute action importante :

```text
Tester en lab.
Limiter le périmètre.
Prévoir un retour arrière.
Exporter l’état initial.
Journaliser l’exécution.
```

Un bon script n’est pas seulement un script qui fonctionne.

C’est un script :

```text
compréhensible,
contrôlable,
traçable,
sécurisé,
et réutilisable.
```