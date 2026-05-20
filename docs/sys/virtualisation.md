# 🏗️ Virtualisation & Conteneurs (Hyper-V, Proxmox, Docker)

La virtualisation permet de faire tourner plusieurs systèmes sur une seule machine physique. On distingue deux mondes : la **virtualisation lourde** (VM) et la **virtualisation légère** (Conteneurs).



---

## 🖥️ 1. Les Hyperviseurs (Machines Virtuelles)

Une VM simule un matériel complet (BIOS, CPU, RAM, Disque). C'est l'idéal pour isoler totalement des services ou faire tourner des OS différents (Windows sur Linux).

### Les solutions majeures
* **Type 1 (Bare Metal) :** S'installe directement sur le fer (le serveur).
    * **Proxmox VE :** 🟢 Open Source (Basé sur Debian). Le roi des Labs et des PME. Gère les VMs classiques et les conteneurs **LXC** (très légers).
    * **VMware ESXi :** 🔴 Propriétaire. Le standard historique (en forte baisse suite au rachat par Broadcom).
    * **Microsoft Hyper-V :** 🔴 Inclus dans Windows Server. Idéal pour les environnements 100% Microsoft.
* **Type 2 (Hosted) :** S'installe comme un logiciel sur ton Windows/Mac.
    * **VirtualBox / VMware Workstation :** Parfait pour tester des OS rapidement sur son PC de bureau.

### 💡 Concepts clés à connaître
* **Snapshot (Instantané) :** Une "photo" de la VM à un instant T. Permet de revenir en arrière en 2 secondes si une mise à jour casse tout. 
>(⚠️ *Ce n'est pas une sauvegarde pérenne !*).
* **Thin Provisioning (Allocation dynamique) :** Le disque de la VM ne prend que la place réelle des fichiers sur le stockage physique, pas la taille totale allouée (ex: Un disque de 100Go avec 10Go de données ne pèsera que 10Go sur le serveur).
* **Pass-through :** Donner l'accès direct et exclusif d'un composant physique (carte graphique GPU, contrôleur USB) à une VM.

---

## 🐳 2. Docker & Conteneurs (La révolution)

Contrairement à une VM, un conteneur ne contient pas d'OS complet. Il embarque uniquement l'application et ses dépendances, et partage le noyau (Kernel) de la machine hôte. C'est **10x plus léger** et **démarre en quelques secondes**.

### ⚠️ Le concept vital : Les Volumes
Par défaut, un conteneur est **éphémère**. Si on le supprime, les données à l'intérieur sont détruites. Pour conserver une base de données ou des fichiers web de façon permanente, on doit "monter" un **Volume** (un dossier de l'hôte lié au conteneur).

### 🛠️ Les commandes de survie Docker (CLI)

| Action | Commande | Explication |
| :--- | :--- | :--- |
| **Chercher une image** | `docker search debian` | Cherche sur le Docker Hub (le magasin d'images public). |
| **Lancer un conteneur** | `docker run -d --name mon-web -p 80:80 nginx` | Lance un serveur Web Nginx en arrière-plan (`-d`) et map le port 80. |
| **Voir les conteneurs** | `docker ps -a` | Liste les conteneurs qui tournent et ceux qui sont arrêtés. |
| **Entrer dedans**| `docker exec -it mon-web bash` | Ouvre un terminal *à l'intérieur* du conteneur en cours de route. |
| **Arrêter / Supprimer** | `docker stop mon-web` | Puis `docker rm mon-web` pour le détruire. |
| **Nettoyer le système** | `docker system prune -a` | Supprime tout ce qui est inutile (images non utilisées, cache). |

---

## 📑 3. Docker Compose (L'automatisation)

Personne ne tape 50 lignes de `docker run` en production. On utilise un fichier **YAML** (`docker-compose.yml`) pour décrire et lancer toute une infrastructure en une seule commande.

### Exemple : Déployer un WordPress complet avec sa Base de Données

```yaml
version: '3.8'

services:
  db:
    image: mariadb:10.6
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password_super_secure
      MYSQL_DATABASE: wordpress_db
    volumes:
      - db_data:/var/lib/mysql # <- Sauvegarde la BDD sur l'hôte

  wordpress:
    image: wordpress:latest
    restart: always
    ports:
      - "8080:80" # Accès via http://localhost:8080
    environment:
      WORDPRESS_DB_HOST: db # Le nom du service au-dessus !
      WORDPRESS_DB_NAME: wordpress_db
      WORDPRESS_DB_PASSWORD: root_password_super_secure
    depends_on:
      - db # Attend que la BDD démarre en premier

volumes:
  db_data: # Déclaration du volume persistant
```

### 🛠️ Commandes Docker Compose essentielles

| Action | Commande | Explication |
| :--- | :--- | :--- |
| **Démarrer la stack** | `docker compose up -d` | Lance tous les services en arrière-plan. |
| **Arrêter la stack** | `docker compose down` | Stoppe et supprime les conteneurs (les volumes persistent). |
| **Tout supprimer** | `docker compose down -v` | ⚠️ Supprime aussi les volumes (données perdues). |
| **Voir les logs** | `docker compose logs -f` | Suit les logs de tous les services en direct. |
| **Logs d'un service** | `docker compose logs -f wordpress` | Suit uniquement le service WordPress. |
| **Redémarrer un service** | `docker compose restart wordpress` | Redémarre un seul service sans toucher aux autres. |
| **Mettre à jour les images** | `docker compose pull && docker compose up -d` | Récupère les dernières images et recrée les conteneurs. |
| **État de la stack** | `docker compose ps` | Liste les conteneurs de la stack avec leur statut. |

---

## 📦 4. LXC : conteneurs Linux "système" (Proxmox)

Contrairement à Docker qui isole une **application**, **LXC** isole un **système Linux complet** (init, services, plusieurs processus). C'est l'approche par défaut sur **Proxmox VE** pour les conteneurs.

### 🆚 LXC vs Docker

| Critère | LXC | Docker |
| :--- | :--- | :--- |
| Philosophie | Conteneur "système" (OS complet) | Conteneur "application" (1 process) |
| Init | systemd / sysvinit | aucun (PID 1 = l'app) |
| Persistance | Stockage propre, persistant | Éphémère + volumes |
| Cas d'usage typique | Petit serveur léger (Nginx, BDD, jeux) | Microservices, CI/CD, dev local |
| Sur Proxmox | Natif (CT) | Possible mais peu courant |

### 🛠️ Commandes LXC (Proxmox CLI)

| Action | Commande | Explication |
| :--- | :--- | :--- |
| **Lister les CT** | `pct list` | Affiche tous les conteneurs LXC du nœud. |
| **Créer un CT** | `pct create 101 local:vztmpl/debian-12-standard_*.tar.zst --hostname web01 --memory 512 --net0 name=eth0,bridge=vmbr0,ip=dhcp` | Crée un CT Debian 12 avec 512 Mo de RAM et IP DHCP. |
| **Démarrer / Arrêter** | `pct start 101` / `pct stop 101` | Cycle de vie du CT. |
| **Entrer dedans** | `pct enter 101` | Ouvre un shell root à l'intérieur. |
| **Snapshot** | `pct snapshot 101 avant-maj` | Sauvegarde instantanée avant changement. |
| **Restaurer** | `pct rollback 101 avant-maj` | Revient au snapshot. |
| **Supprimer** | `pct destroy 101` | ⚠️ Détruit le CT et ses données. |

!!! tip "Astuce Proxmox"
    Les **templates LXC** se téléchargent depuis l'interface web Proxmox : `Datacenter → node → local → CT Templates`. Choisis toujours la version `standard` pour avoir un système minimal.

---

## 🧠 5. Quand choisir quoi ?

| Besoin | Solution recommandée |
| :--- | :--- |
| Faire tourner un OS différent (Windows sur Linux) | **VM (Hyper-V / Proxmox / ESXi)** |
| Isoler un service critique avec son propre kernel | **VM** |
| Déployer une appli web moderne (Nginx + PHP + DB) | **Docker Compose** |
| Stack microservices en production | **Kubernetes** (hors scope ici) |
| Petit serveur Linux léger sur Proxmox | **LXC (CT)** |
| Reproduire un environnement de dev sur son PC | **Docker** ou **VM type 2** |
| Lab CCNA / pentest | **VM (VirtualBox / GNS3 / EVE-NG)** |

---

## 🩺 6. Troubleshooting virtualisation

| Symptôme | Cause probable |
| :--- | :--- |
| VM lente alors que CPU OK | I/O disque saturée, Thin Provisioning sur disque lent, snapshot trop ancien |
| Conteneur Docker qui meurt en boucle | Mauvaise commande au boot, dépendance absente (ex : DB pas prête → `depends_on` + healthcheck) |
| `Permission denied` sur volume Docker | Problème UID/GID entre l'hôte et le conteneur (`chown -R 1000:1000 /chemin`) |
| `Cannot start service: driver failed programming external connectivity` | Port déjà utilisé sur l'hôte (vérifier `ss -tulpn`) |
| LXC qui ne démarre pas après MAJ Proxmox | Kernel incompatible avec le template — recréer ou migrer le CT |
| Snapshot qui grossit sans fin sur VM | Snapshot oublié depuis des semaines — à fusionner via `Checkpoint-VM` ou GUI |
