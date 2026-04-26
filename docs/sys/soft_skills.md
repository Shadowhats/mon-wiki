# 🤝 Procédures & Modèles (Soft Skills)

L'informatique ne se résume pas à la technique. La qualité de la documentation, la clarté de la communication lors d'un incident et la rigueur des processus de mise en production sont les marques d'un administrateur système professionnel.

---

## 🚨 1. Modèle de Compte-Rendu d'Incident (CRI)

*À rédiger après chaque panne majeure pour documenter ce qui s'est passé et éviter que cela ne se reproduise.*

### 📋 Informations Générales
* **ID Incident :** INC-YYYYMMDD-001
* **Date & Heure :** [Date] à [Heure]
* **Durée de l'interruption :** [X minutes / heures]
* **Gravité :** [Basse / Moyenne / Haute / Critique]
* **Rédacteur :** [Ton Nom]

### 🔍 Description & Impact
* **Services impactés :** (ex: Serveur de fichiers, Accès VPN...)
* **Nombre d'utilisateurs touchés :** (ex: Tous les services, Agence de Lyon...)
* **Symptômes :** (ex: "Accès refusé" lors de la connexion au lecteur S:)

### ⏳ Chronologie (Timeline)
* **10:00 :** Détection de l'incident (alerte Zabbix / appel utilisateur).
* **10:15 :** Début des investigations sur le serveur SRV-FILE.
* **10:45 :** Identification de la cause (Espace disque saturé).
* **11:00 :** Nettoyage des logs et redémarrage du service.
* **11:15 :** Retour à la normale et validation avec les utilisateurs.

### 🛠️ Solution & Prévention
* **Cause racine :** (ex: La rotation des logs IIS ne fonctionnait plus).
* **Action corrective :** Nettoyage manuel et redémarrage.
* **Mesures préventives :** Ajout d'une alerte seuil critique à 90% d'occupation disque et script de purge automatique.

---

## 🎒 2. Check-list d'Onboarding (Arrivée d'un collaborateur)

*Pour s'assurer qu'un nouvel employé est opérationnel dès son arrivée sans rien oublier.*

### 🛠️ Matériel & Physique
- [ ] Préparation du poste (PC fixe/portable) + Périphériques (Clavier, Souris, Écrans).
- [ ] Inventaire matériel mis à jour dans **GLPI**.
- [ ] Badge d'accès aux locaux / parking.

### 🔑 Comptes & Identité
- [ ] Création du compte **Active Directory**.
- [ ] Création de la boîte mail (**Microsoft 365 / Exchange**).
- [ ] Attribution des licences logicielles nécessaires.
- [ ] Ajout aux groupes de distribution (Emails) et groupes de sécurité (Accès fichiers).

### 🌐 Réseau & Sécurité
- [ ] Configuration de l'accès **VPN** (si nomade).
- [ ] Configuration de l'**Authentification Multi-Facteurs (MFA)**.
- [ ] Mappage des lecteurs réseaux et installation des imprimantes.

---

## 🚀 3. Procédure de Mise en Production (MEP)

*À suivre avant de modifier une configuration critique ou d'installer un nouveau serveur.*

### ✅ Pré-requis (Avant)
- [ ] **Sauvegarde / Snapshot :** Vérifier qu'un backup récent existe et est fonctionnel.
- [ ] **Fenêtre d'intervention :** Prévenir les utilisateurs de l'indisponibilité (ex: de 18h à 19h).
- [ ] **Plan de Rollback :** Procédure précise pour revenir en arrière en cas d'échec.

### 🛠️ Exécution (Pendant)
- [ ] Suivre pas à pas le guide d'installation/configuration.
- [ ] Documenter chaque étape inhabituelle rencontrée.
- [ ] Noter les messages d'erreurs ou les warnings.

### 🏁 Validation & Clôture (Après)
- [ ] Tests fonctionnels (Est-ce que le service répond ? Est-ce que les droits sont bons ?).
- [ ] Mise à jour de la documentation technique (Wiki) et des schémas réseau.
- [ ] Communication de fin d'intervention aux utilisateurs.