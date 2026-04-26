# 🛡️ Bonnes pratiques : NIS2 & Hygiène ANSSI

Ce référentiel fusionne les obligations légales de la directive européenne NIS2 et les mesures techniques du Guide d'Hygiène Informatique de l'ANSSI. L'objectif est de sécuriser le Système d'Information (SI) et de répondre aux exigences de l'État.



> **💡 Pourquoi c'est important ?**
> La directive NIS2 impose un cadre légal strict aux entreprises européennes, en s'appuyant massivement sur les principes d'hygiène de l'ANSSI. Elle passe d'une logique de "recommandation" à une logique "d'obligation et de sanction".

---

## 📜 1. Directive NIS2 : Le Cadre Légal et les Sanctions

### 🎯 Qui est concerné ?
* Le périmètre s'est élargi à **18 secteurs d'activité** (Santé, Énergie, Transports, Eaux, Banques, Infrastructures Numériques, etc.).
* Cela concerne désormais entre **10 000 et 15 000 entités** en France (contre environ 300 pour la précédente version).

### 🗂️ Les Deux Catégories d'Entités
1.  **Les Entités Essentielles (EE) :** Ont un impact critique sur la société ou l'économie (ex: Hôpitaux, Énergie, Opérateurs Cloud). 
2.  **Les Entités Importantes (EI) :** Ont un rôle clé mais avec un impact systémique moindre (ex: Gestion des déchets, Services postaux, Fabrication).

### ⚖️ Les Sanctions (Le "Bâton")
Le non-respect des obligations expose les entreprises à de lourdes amendes :

* **Entités Essentielles :** Jusqu'à 10 millions d'euros ou 2 % du chiffre d'affaires mondial.

* **Entités Importantes :** Jusqu'à 7 millions d'euros ou 1,4 % du chiffre d'affaires.

---

## 🏗️ 2. Les 10 Piliers de Sécurité Obligatoires (NIS2)

Pour être en conformité, les organisations doivent couvrir 10 grands domaines :

| Domaine | Description et Obligation |
| :--- | :--- |
| **1. Analyse des Risques** | Identifier, analyser et évaluer régulièrement les risques cyber documentés. |
| **2. Gestion des Incidents** | Signaler obligatoirement tout incident majeur : alerte précoce en **24 heures** à l'ANSSI, et notification détaillée sous **72 heures**. |
| **3. Continuité (PCA/PRA)** | Avoir des plans de sauvegarde, de restauration et de continuité d'activité. |
| **4. Supply Chain** | Identifier et auditer les fournisseurs/sous-traitants critiques pour éviter les attaques par rebond. |
| **5. Sécurité RH** | Contrôler fermement les accès, et gérer scrupuleusement les procédures d'arrivée et de départ des collaborateurs. |
| **6. Cryptographie** | Définir des politiques pour chiffrer les données sensibles (au repos et en transit). |
| **7. Hygiène & Formation** | Imposer une formation continue à **100 % des employés** (dirigeants inclus), avec une traçabilité de l'efficacité. |
| **8. Gouvernance** | Impliquer la Direction, qui doit approuver la politique de sécurité et assumer les responsabilités. |
| **9. Authentification** | Déployer des solutions d'Authentification Multifacteurs (MFA) ou d'authentification continue. |
| **10. Évaluation Continue** | Tester régulièrement l'efficacité des mesures de défense déployées (ex: audits, pentests). |

---

## 🧼 3. Les Bonnes Pratiques d'Hygiène de l'ANSSI (Le Terrain)

Pour répondre à NIS2, l'ANSSI s'appuie sur son fameux *Guide d'Hygiène Informatique*. Voici les actions concrètes que le SysAdmin doit mettre en place :

### 👤 Identité et Contrôle d'Accès
* **Moindre Privilège :** Distinguer strictement les rôles "Utilisateur" et "Administrateur". Personne ne doit utiliser son compte admin pour lire ses emails !
* **Gestion des Mots de Passe :** Définir et vérifier des règles de choix et de dimensionnement des mots de passe. 
* **Protection des Sésames :** Protéger les mots de passe stockés et interdire les identifiants par défaut sur les équipements (switchs, routeurs).
* **Inventaire Privilégié :** Disposer d'un inventaire exhaustif et à jour des comptes à hauts privilèges.

### 💻 Architecture et Postes de Travail
* **Cartographie :** Connaître le système d'information, identifier les serveurs sensibles et maintenir un schéma réseau à jour.
* **Filtrage Réseau :** N'autoriser la connexion au réseau qu'aux équipements maîtrisés par l'entreprise (Contrôle d'accès type 802.1x).
* **Sécuriser les postes :** Mettre en place un niveau de sécurité minimal et homogène sur tout le parc (EDR, Antivirus, Pare-feu local).
* **Produits de confiance :** Privilégier l'usage de produits et services *Qualifiés par l'ANSSI* (ex: Stormshield, HarfangLab, Olvid).

### 🛡️ Protection des Données et Résilience
* **Chiffrement Nomade :** Chiffrer obligatoirement les données sensibles sur du matériel potentiellement perdable (BitLocker sur les PC portables).
* **Chiffrement Flux :** Chiffrer les données sensibles transmises via Internet (HTTPS, VPN IPsec).
* **Sauvegardes Critiques :** Définir et appliquer une politique de sauvegarde stricte et déconnectée (hors ligne) pour protéger les composants critiques contre les Ransomwares.