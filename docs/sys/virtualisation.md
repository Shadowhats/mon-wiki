# 🏗️ Virtualisation & Conteneurs (Hyper-V, Proxmox, Docker)

La virtualisation permet de faire tourner plusieurs systèmes sur une seule machine physique. On distingue deux mondes : la **virtualisation lourde** (VM) et la **virtualisation légère** (Conteneurs).



---

## 🖥️ 1. Les Hyperviseurs (Machines Virtuelles)

Une VM simule un matériel complet (BIOS, CPU, RAM, Disque). C'est l'idéal pour isoler totalement des services ou faire tourner des OS différents (Windows sur Linux).

### Les solutions majeures
* **Type 1 (Bare Metal) :** S'installe directement sur le serveur.
    * **Proxmox VE :** 🟢 Open Source (Basé sur Debian). Le roi des Labs et des PME.
    * **VMware ESXi :** 🔴 Propriétaire. Le standard historique (en perte de vitesse suite au rachat par Broadcom).
    * **Microsoft Hyper-V :** 🔴 Inclus dans Windows Server. Idéal pour les environnements 100% Microsoft.
* **Type 2 (Hosted) :** S'installe comme un logiciel sur ton Windows/Mac.
    * **VirtualBox / VMware Workstation :** Parfait pour tester des trucs rapidement sur son PC.

### 💡 Concepts clés à connaître
* **Snapshot :** Une "photo" de la VM à un instant T. Permet de revenir en arrière en 2 secondes si une mise à jour casse tout. (⚠️ *Ce n'est pas une sauvegarde !*).
* **Thin Provisioning :** Le disque de la VM ne prend que la place réelle des fichiers, pas la taille totale allouée.
* **Pass-through :** Donner l'accès direct d'un composant physique (carte GPU, clé USB) à une VM.

---

## 🐳 2. Docker & Conteneurs (La révolution)

Contrairement à une VM, un conteneur ne contient pas d'OS complet. Il partage le noyau (Kernel) de la machine hôte. C'est **10x plus léger** et **100x plus rapide** à démarrer.



### Les commandes de survie Docker (CLI)

| Action | Commande | Explication |
| :--- | :--- | :--- |
| **Chercher une image** | `docker search debian` | Cherche sur le Docker Hub (le magasin d'images). |
| **Lancer un conteneur** | `docker run -d --name mon-web -p 80:80 nginx` | Lance un serveur Web Nginx en arrière-plan (`-d`) sur le port 80. |
| **Voir les conteneurs** | `docker ps -a` | Liste les conteneurs qui tournent (et ceux arrêtés). |
| **Entrer dans un conteneur**| `docker exec -it mon-web bash` | Ouvre un terminal *à l'intérieur* du conteneur. |
| **Arrêter / Supprimer** | `docker stop mon-web` | Puis `docker rm mon-web` pour le détruire. |
| **Nettoyer le système** | `docker system prune` | Supprime tout ce qui est inutile (images orphelines, cache). |

---

## 📑 3. Docker Compose (L'automatisation)

Personne ne tape 50 lignes de `docker run`. On utilise des fichiers **YAML** pour décrire toute une infrastructure (ex: un WordPress + une base de données).

Exemple de fichier `docker-compose.yml` :
```yaml
version: '3'
services:
  db:
    image: mariadb
    environment:
      MYSQL_ROOT_PASSWORD: password
  wordpress:
    image: wordpress
    ports:
      - "8080:80"
    links:
      - db