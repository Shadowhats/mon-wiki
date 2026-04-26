# 🧰 Guide Ultime de Dépannage : Active Directory & GPO

L'Active Directory est le cœur du système d'information. Quand il dysfonctionne, c'est toute l'entreprise qui s'arrête. Voici les méthodologies et commandes pour résoudre les pannes les plus courantes.

> **💡 Les 3 Règles d'Or de l'AD :**

> 1. **C'est toujours la faute du DNS :** L'AD repose à 100% sur le DNS. Si le DNS plante, l'AD meurt.
> 2. **Le Ticket Kerberos :** Si tu ajoutes un utilisateur à un groupe, il n'aura ses droits que **lorsqu'il aura fermé et rouvert sa session Windows** (pour générer un nouveau ticket). Inutile de faire des `gpupdate` en boucle !
> 3. **Patience (La Réplication) :** Si tu crées un utilisateur sur le Serveur A, il faut parfois 15 minutes pour qu'il apparaisse sur le Serveur B (sur un autre site). 



---

## 📁 Scénario 1 : "Je suis de la RH et je ne vois plus mon lecteur réseau S:" (Problème GPO/Droits)

*Un grand classique. Le lecteur est censé monter tout seul grâce à une GPO (Préférences de stratégie de groupe).*

### Étape 1 : Le PC a-t-il bien reçu la GPO ?
Ouvre une invite de commande (CMD) sur le PC de l'utilisateur RH :
* **Voir les GPO appliquées au User :** `gpresult /r`

* *Vérification :* Cherche le nom de la GPO (ex: `GPO_Lecteurs_Réseaux`) dans la section "Stratégies appliquées". Si elle est dans "Stratégies refusées", regarde la raison (Souvent : "Filtre WMI" ou "Filtrage de sécurité").

* **Générer un rapport visuel complet :** `gpresult /h C:\BilanGPO.html` (Ouvre ensuite ce fichier dans Chrome pour voir exactement ce qui coince).

### Étape 2 : L'utilisateur fait-il vraiment partie du groupe RH ?
L'AD a peut-être perdu le lien, ou le ticket de session est vieux.

* **Commande sur le PC client :** `whoami /groups`

* *Vérification :* Cherche le groupe "GG_Ressources_Humaines". S'il n'y est pas, demande à l'utilisateur de fermer sa session et de se reconnecter.

### Étape 3 : Le serveur de fichiers est-il accessible ?
Testons manuellement si le problème vient de la GPO ou des droits du dossier.

* **Tester l'accès brut :** Touche `Windows + R`, puis tape `\\SRV-FICHIERS\Partages$\RH`. 

* *Résultat :* Si Windows dit "Accès refusé", c'est un problème de droits NTFS sur le serveur, pas un problème de GPO ! S'il accède au dossier, c'est la GPO de mappage qui a échoué.

* **Forcer la GPO :** `gpupdate /force`

---

## 🔑 Scénario 2 : "Mon compte se bloque tout seul toutes les 5 minutes !" (Lockout)

*L'utilisateur jure qu'il tape le bon mot de passe, mais son compte Active Directory se verrouille en boucle. C'est une machine ou un service caché qui tape l'ancien mot de passe en arrière-plan.*

### Étape 1 : Identifier le serveur qui verrouille (PDC)
Dans l'AD, c'est le serveur qui possède le rôle "Émulateur PDC" qui valide les mots de passe et bloque les comptes.

1. Connecte-toi sur le Contrôleur de Domaine principal.

2. Ouvre PowerShell : `Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4740]]"`

3. *Explication :* L'événement **4740** signifie "Compte verrouillé". Dans les détails du log, tu verras le **"Nom de l'ordinateur appelant"**. 


### Étape 2 : Traquer la source (Les coupables habituels)
Une fois que tu as le nom de l'ordinateur qui verrouille le compte, cherche ceci :

* **Le Smartphone (Wi-Fi) :** Le téléphone de l'utilisateur est connecté au Wi-Fi de l'entreprise avec son *ancien* mot de passe. Il essaie de se connecter en boucle et bloque le compte.

* **Lecteur réseau persistant :** Un lecteur réseau enregistré avec l'ancien mot de passe (`net use * /delete` pour nettoyer).

* **Service Windows :** L'utilisateur a configuré un service Windows ou une Tâche Planifiée sur un serveur pour qu'elle tourne avec son compte au lieu d'un compte de service.

---

## 🚫 Scénario 3 : "La relation d'approbation a échoué" (Trust Relationship)

*L'utilisateur allume son PC le matin, tape son mot de passe et voit : "La relation d'approbation entre cette station de travail et le domaine principal a échoué." Le PC est "sorti" du domaine.*

### Pourquoi ça arrive ?
Le PC et l'AD partagent un mot de passe machine secret qui change tous les 30 jours. Si le PC reste éteint 3 mois dans un placard, ou qu'il est restauré depuis un vieux snapshot, le mot de passe ne correspond plus. Le PC est rejeté.

### La Solution Rapide (Sans sortir du domaine manuellement) :
1. Connecte-toi sur le PC avec le compte **Administrateur Local** de la machine (ex: `.\Administrateur`).
2. Ouvre PowerShell en mode administrateur.
3. Tape la commande magique de réparation : 
   `Test-ComputerSecureChannel -Repair -Credential (Get-Credential)`
4. Entre les identifiants d'un Administrateur du Domaine (ex: `STUDI\Admin.IT`).
5. Redémarre. Le PC est de nouveau ami avec l'AD !

---

## 🧱 Scénario 4 : "J'ai appliqué la GPO de Fond d'écran, mais elle ne descend pas !"

*Tu as créé une GPO pour mettre le logo de l'entreprise en fond d'écran, mais la moitié des PC ont un écran noir ou l'ancien fond.*

### Les points de blocage à vérifier :
1. **Scope (Étendue) :** La GPO est-elle liée à la bonne OU (Unité Organisationnelle) ? Si la GPO s'applique à des Utilisateurs, elle doit être liée sur l'OU où sont rangés les Utilisateurs (pas l'OU des Ordinateurs).
2. **Héritage bloqué :** L'OU cible a-t-elle l'icône "Héritage bloqué" (Cercle bleu avec point d'exclamation) ? Si oui, force la GPO (`Clic droit -> Appliqué/Enforced`).
3. **Chemin réseau du fichier :** Dans la GPO, le chemin de l'image est-il `C:\Images\logo.jpg` ? C'est une erreur ! Le PC cherchera l'image sur *son propre* disque C:\ ! Il faut mettre un chemin UNC accessible à tous en lecture (ex: `\\SRV-AD01\Netlogon\logo.jpg`).
4. **Vider le cache du PC récalcitrant :** `gpupdate /force /boot`

---

## 🔄 Scénario 5 : "Le serveur de l'agence de Lyon ne voit pas les nouveaux employés" (Problème de Réplication)

*Tu as créé un profil à Paris (Serveur AD1), mais l'utilisateur n'arrive pas à se connecter sur son PC à Lyon (Serveur AD2).*

### Étape 1 : Vérifier l'état de la réplication
Sur le serveur de Paris, ouvre une invite de commande (Admin) :
* `repadmin /showrepl`
* *Résultat :* Cette commande t'affiche la dernière fois que les serveurs ont discuté. S'il y a des erreurs (ex: "Access Denied" ou "RPC Server Unavailable"), la réplication est cassée.

### Étape 2 : Forcer la synchronisation manuelle
* `repadmin /syncall /A /e /P`
* *Action :* Oblige tous les contrôleurs de domaine de la forêt à se synchroniser immédiatement. 

### Étape 3 : Le test DNS (Le coupable à 99%)
Si la réplication échoue avec l'erreur "RPC Server Unavailable", c'est que Paris n'arrive pas à résoudre le nom du serveur de Lyon (ou que le pare-feu VPN entre les deux villes est tombé).
* Test : `ping SRV-AD-LYON.studi.srv`
* Test : `dcdiag /test:dns` (Lance un audit complet de la santé DNS de l'AD).