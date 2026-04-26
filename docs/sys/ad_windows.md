# 🪟 L'Encyclopédie Windows Server & PowerShell

Ce mémo est le référentiel complet d'administration système : de l'installation d'un Contrôleur de Domaine jusqu'aux rôles avancés (Hyper-V, WSUS, WDS, PKI) et au dépannage via PowerShell.

---

## ⚙️ 1. Système & Paramètres de base

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Renommer Serveur** | `Rename-Computer -NewName` | `Rename-Computer "SRV-AD01" -Restart -Force` |
| **Description Serveur** | `Set-ItemProperty -Value` | `Set-ItemProperty -Path "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" -Name "srvcomment" -Value "Contrôleur de Domaine Principal"` |
| **IP Fixe (IPv4)** | `New-NetIPAddress` | `New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.10.10 -PrefixLength 24 -DefaultGateway 192.168.10.254` |
| **IP Fixe (IPv6)** | `New-NetIPAddress` | `New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 2001:db8::10 -PrefixLength 64 -AddressFamily IPv6` |
| **Client DNS** | `Set-DnsClientServerAddress` | `Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 127.0.0.1, 192.168.10.11` |
| **Routage Statique** | `New-NetRoute` | `New-NetRoute -DestinationPrefix 10.0.0.0/8 -InterfaceAlias "Ethernet" -NextHop 192.168.10.254` |
| **Heure Maître (NTP)** | `w32tm /config` | `w32tm /config /manualpeerlist:"0.fr.pool.ntp.org" /syncfromflags:manual /reliable:YES /update` |
| **Pare-feu Global** | `Set-NetFirewallProfile` | `Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True -DefaultInboundAction Block` |
| **Ouvrir Port Pare-feu** | `New-NetFirewallRule` | `New-NetFirewallRule -DisplayName "Autoriser Port 8000" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow` |
| **Joindre PC au Domaine**| `Add-Computer -DomainName` | `Add-Computer -DomainName "studi.srv" -OUPath "OU=Ordinateurs,DC=studi,DC=srv" -Credential (Get-Credential) -Restart` |
| **Gérer un Service** | `Restart-Service -Name` | `Restart-Service -Name Spooler -Force` |

---

## 👑 2. Active Directory (AD DS) : Forêt & Contrôleurs

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Installer Rôle AD DS** | `Install-WindowsFeature` | `Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools` |
| **Créer Forêt** | `Install-ADDSForest` | `Install-ADDSForest -DomainName "studi.srv" -DomainNetbiosName "STUDI" -InstallDns -Force` |
| **Ajout Contrôleur (DC)** | `Install-ADDSDomainController` | `Install-ADDSDomainController -DomainName "studi.srv" -Credential (Get-Credential) -InstallDns -GlobalCatalog` |
| **Rôles FSMO (Transfert)**| `Move-ADDirectoryServerOperationMasterRole` | Transfert des rôles : `... -OperationMasterRole SchemaMaster, DomainNamingMaster, PDCEmulator, RIDMaster, InfrastructureMaster -Force` |
| **Activer Corbeille AD** | `Enable-ADOptionalFeature` | `Enable-ADOptionalFeature -Identity 'Recycle Bin Feature' -Scope ForestOrConfigurationSet -Target "studi.srv"` |
| **Restaurer depuis Corbeille**| `Restore-ADObject` | `Get-ADObject -Filter 'Name -like "*Paul Tech*"' -IncludeDeletedObjects | Restore-ADObject` |
| **Niveau Fonctionnel** | `Set-ADDomainMode` | `Set-ADDomainMode -Identity "studi.srv" -DomainMode Windows2016Domain` |
| **Sites Physiques** | `New-ADReplicationSite` | `New-ADReplicationSite -Name "Site_Paris" -Description 'Siège Social'` |
| **Sous-réseaux AD** | `New-ADReplicationSubnet` | `New-ADReplicationSubnet -Name "192.168.10.0/24" -Site "Site_Paris"` |
| **Approbation Domaines** | `Add-ADComputerServiceAccount`| Crée une relation de confiance (Trust). |

---

## 👥 3. Objets AD (Utilisateurs, Groupes, OUs)

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Création OU** | `New-ADOrganizationalUnit` | `New-ADOrganizationalUnit -Name "Informatique" -Path "DC=studi,DC=srv"` |
| **Création Base User** | `New-ADUser` | `New-ADUser -Name "Paul Tech" -SamAccountName p.tech ... -AccountPassword (ConvertTo-SecureString "Mdp!" -AsPlainText -Force) -Enabled $true` |
| **Mots de passe fins (FGPP)**| `New-ADFineGrainedPasswordPolicy` | Oblige une longueur ou complexité spécifique à un groupe. |
| **Infos Contact User** | `Set-ADUser` | `Set-ADUser -Identity p.tech -OfficePhone "0123456789" -EmailAddress "p.tech@studi.srv"` |
| **Adresse & Organisation**| `Set-ADUser` | Modifier le Titre/Département : `Set-ADUser -Identity p.tech -Title "Admin Sys" -Department "Support IT"` |
| **Profil Itinérant** | `Set-ADUser -ProfilePath` | `Set-ADUser -Identity "p.tech" -ProfilePath "\\SRV-SAMBA\Profils$\p.tech" -HomeDirectory "\\SRV-SAMBA\Homes$\p.tech" -HomeDrive "U:"` |
| **Restrictions PC** | `Set-ADUser -LogonWorkstations`| Restreint les PC de connexion : `Set-ADUser -Identity "p.tech" -LogonWorkstations "PC-TECH01, PC-TECH02"` |
| **Heures de Connexion** | `Set-ADUser -LogonHours` | Interdire le travail de nuit via un tableau de bytes. |
| **Expiration Compte** | `Set-ADAccountExpiration` | `Set-ADAccountExpiration -Identity "p.tech" -DateTime "12/31/2026 23:59:00"` |
| **Réinitialiser Mdp** | `Set-ADAccountPassword` | `Set-ADAccountPassword -Identity "p.tech" -NewPassword (...) -Reset` |
| **Débloquer Compte** | `Unlock-ADAccount` | `Unlock-ADAccount -Identity "p.tech"` |
| **Création Groupe** | `New-ADGroup` | `New-ADGroup -Name "GRP_IT" -GroupCategory Security -GroupScope Global` |
| **Ajouter au Groupe** | `Add-ADGroupMember` | `Add-ADGroupMember -Identity "GRP_IT" -Members "p.tech"` |

---

## 🌐 4. DNS (Annuaire) & DHCP (Distribution d'IP)

### 📘 DNS
| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Zone Directe** | `Add-DnsServerPrimaryZone` | `Add-DnsServerPrimaryZone -Name "studi.srv" -ReplicationScope Domain` |
| **Zone Inverse** | `Add-DnsServerPrimaryZone` | `Add-DnsServerPrimaryZone -NetworkId 192.168.10.0/24 -ReplicationScope Domain` |
| **Hôte (A / AAAA)** | `Add-DnsServerResourceRecordA` | `Add-DnsServerResourceRecordA -ZoneName "studi.srv" -Name "SRV-SAMBA" -IPv4Address 192.168.10.20 -CreatePtr` |
| **Alias (CNAME)** | `Add-DnsServerResourceRecordCName`| `Add-DnsServerResourceRecordCName -ZoneName "studi.srv" -Name "www" -HostNameAlias "srv-web01.studi.srv"` |
| **Mail (MX)** | `Add-DnsServerResourceRecordMX`| Définit le serveur mail : `... -MailExchange "mail.studi.srv" -Preference 10` |
| **Texte (TXT/SPF)** | `Add-DnsServerResourceRecord` | Ajoute un champ TXT (ex: anti-spam SPF). |
| **Redirecteurs Globaux** | `Add-DnsServerForwarder` | `Add-DnsServerForwarder -IPAddress 8.8.8.8, 1.1.1.1 -PassThru` |
| **Redirecteur Conditionnel**| `Add-DnsServerConditionalForwarderZone` | Pointe vers le DNS d'une filiale pour une zone précise. |
| **Nettoyage (Scavenging)**| `Set-DnsServerScavenging` | Supprime les IP fantômes automatiquement. |

### 🛟 DHCP
| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Autoriser DHCP** | `Add-DhcpServerInDC` | Autorise le serveur dans l'AD. |
| **Nouvelle Étendue** | `Add-DhcpServerv4Scope` | `Add-DhcpServerv4Scope -Name "LAN" -StartRange 192.168.10.100 -EndRange 192.168.10.200 -SubnetMask 255.255.255.0 -State Active` |
| **Options (003, 006, 015)** | `Set-DhcpServerv4OptionValue` | Option 3 (Routeur), 6 (DNS), 15 (Suffixe DNS). |
| **Réservation MAC** | `Add-DhcpServerv4Reservation` | `Add-DhcpServerv4Reservation -ScopeId 192.168.10.0 -IPAddress 192.168.10.150 -ClientId "00-11-22-33-44-55"` |
| **Filtre MAC** | `Add-DhcpServerv4Filter` | Liste blanche/noire d'adresses MAC. |
| **Sauvegarde DHCP** | `Backup-DhcpServer` | `Backup-DhcpServer -Path "C:\Backup_DHCP"` |
| **Failover (Haute Dispo)**| `Add-DhcpServerv4Failover` | Lie 2 serveurs DHCP pour éviter les pannes. |

---

## 📜 5. Stratégies de Groupe (GPO)

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Nouvelle GPO** | `New-GPO -Name` | `New-GPO -Name "SEC_NoUSB" -Comment "Bloque les clés USB"` |
| **Liaison GPO** | `New-GPLink` | `New-GPLink -Name "SEC_NoUSB" -Target "OU=Informatique,DC=studi,DC=srv" -Enforced $true` |
| **Bloquer l'héritage** | `Set-GPOInheritance` | `Set-GPOInheritance -Target "OU=Direction,DC=studi,DC=srv" -IsBlocked Yes` |
| **Filtre WMI** | `New-GPOWmiFilter` | Cible Windows 10 : `... -Query "Select * from Win32_OperatingSystem where Version like '10.%'"` |
| **Sauvegarde GPO** | `Backup-Gpo -All` | `Backup-Gpo -All -Path "C:\Backup_GPOs"` |

---

## 📁 6. Fichiers, Stockage et Partages

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Initialiser Disque** | `Initialize-Disk` | `Initialize-Disk -Number 1 -PartitionStyle GPT` |
| **Partition & Format** | `New-Partition` / `Format-Volume` | `New-Partition -DiskNumber 1 -UseMaximumSize -AssignDriveLetter | Format-Volume -FileSystem NTFS -NewFileSystemLabel "DATA"` |
| **Partage SMB Sécurisé** | `New-SmbShare` | `New-SmbShare -Name "Direction" -Path "D:\Direction" -FullAccess "STUDI\Grp_Direction" -EncryptData $true -FolderEnumerationMode AccessBased` |
| **Clichés (VSS)** | `vssadmin create shadow` | Sauvegarde instantanée d'un volume : `vssadmin create shadow /for=D:` |
| **Quota FSRM** | `New-FsrmQuota` | `New-FsrmQuota -Path "D:\Direction" -Size 50GB -SoftLimit` |

---

## 🏗️ 7. Rôles Serveurs Avancés (Hyper-V, IIS, DFS, Print, PKI, WSUS, WDS)

| Rôle / Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Hyper-V (Switch)** | `New-VMSwitch` | `New-VMSwitch -Name "vSwitch_LAN" -SwitchType Private` |
| **Hyper-V (VM / RAM)** | `New-VM` / `Set-VM` | `New-VM -Name "SRV-WEB01" -MemoryStartupBytes 4GB -Generation 2` |
| **Hyper-V (Snapshot)** | `Checkpoint-VM` | `Checkpoint-VM -Name "SRV-WEB01" -SnapshotName "Avant Mise A Jour"` |
| **IIS (Serveur Web)** | `Install-WindowsFeature` | `Install-WindowsFeature -Name Web-Server -IncludeManagementTools` |
| **IIS (Nouveau Site Web)**| `New-WebSite` | `New-WebSite -Name "Intranet" -Port 80 -PhysicalPath "C:\inetpub\intranet"` |
| **DFS (Serveur / Racine)**| `New-DfsnRoot` | Cache l'emplacement des vrais serveurs sous un nom de domaine. |
| **Print (Serveur Imp.)** | `Add-PrinterPort` / `Add-Printer`| Ajoute le port IP puis l'imprimante réseau partagée. |
| **AD CS (PKI / Certificats)**| `Install-AdcsCertificationAuthority`| Installe le rôle d'Autorité de Certification racine de l'entreprise. |
| **WSUS (Mises à jour)** | `wsusutil.exe postinstall` | Configure le stockage WSUS : `wsusutil.exe postinstall CONTENT_DIR="D:\Updates"` |
| **WSUS (Nettoyage)** | `Invoke-WsusServerCleanup` | Supprime les MAJ obsolètes. |
| **WDS (Déploiement PC)** | `Initialize-Wds` | Formate des PC via PXE : `Initialize-Wds -RemoteInstallDirectory "D:\RemoteInstall"` |
| **WDS (Image Boot)** | `Import-WdsBootImage` | Transforme une clé USB en image bootable réseau WinPE. |
| **Sauvegarde (Backup)** | `Start-WBBackup` | Nécessite la création d'une politique (`New-WBPolicy`), d'un volume, et d'une cible. |

---

## 🔐 8. Sécurité (BitLocker, LAPS) & Exécution Distante (WinRM)

| Action | Commande & Paramètres | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Activer BitLocker** | `Enable-BitLocker` | `Enable-BitLocker -MountPoint "D:" -EncryptionMethod XtsAes256 -UsedSpaceOnly -RecoveryPasswordProtector` |
| **LAPS (Mdp Locaux)** | `Set-AdmPwdComputerSelfPermission`| Donne à l'AD le droit de changer les mdp administrateur locaux des PC. |
| **WinRM (Activer)** | `Enable-PSRemoting -Force` | Ouvre les oreilles du serveur pour écouter les ordres à distance. |
| **Connexion Distante** | `Enter-PSSession` | Prend le contrôle du shell d'un autre PC : `Enter-PSSession -ComputerName "SRV-AD01"` |
| **Exécution Massive** | `Invoke-Command` | Lance un script sur plusieurs PC : `Invoke-Command -ComputerName "PC1", "PC2" -ScriptBlock {Restart-Service Spooler}` |

---

## 🩺 9. Dépannage et Vérifications (Vérif Système, AD, Réseau)

### Commandes pour surveiller le Serveur (PowerShell & CMD)
* **Charge CPU / RAM :** `Get-Counter -Counter "\Processor(_Total)\% Processor Time"`
* **Santé AD (Check-up) :** `dcdiag /v /c /e /f:C:\dcdiag.txt`
* **Synchro des DC :** `repadmin /showrepl`
* **Voir les Sessions Fichiers :** `Get-SmbSession | Select-Object ClientComputerName, ClientUserName`
* **Voir les Erreurs (Crash) :** `Get-WinEvent -FilterHashTable @{LogName='System'; Level=2} -MaxEvents 10`
* **Espace Disque :** `Get-Volume | Select-Object DriveLetter, FileSystemLabel, SizeRemaining`
* **Trouver Gros Fichiers :** `Get-ChildItem -Path C:\ -Recurse -File -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 10`
* **Tuer un Programme :** `Stop-Process -Name notepad -Force`
* **Test Port TCP (Ping avancé) :** `Test-NetConnection -ComputerName "google.com" -Port 443`

### Commandes Côté Client (Poste de l'utilisateur)
* **Vérifier son Contrôleur :** `nltest /dsgetdc:studi.srv`
* **Vérifier ses Groupes :** `whoami /groups`
* **Vider le Cache DNS :** `ipconfig /flushdns`
* **Lâcher / Demander une IP :** `ipconfig /release` puis `ipconfig /renew`
* **Forcer MAJ des GPOs :** `gpupdate /force /boot`
* **Bilan des GPOs actives :** `gpresult /r` (ou `/h Bilan.html`)
* **Réparer Domaine cassé :** `Test-ComputerSecureChannel -Repair -Credential (Get-Credential)`