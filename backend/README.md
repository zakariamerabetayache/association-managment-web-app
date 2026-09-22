
# CRUD LARAVEL-REACT

Description brève du projet.

## Installation

Avant de commencer, assurez-vous d'avoir correctement configuré votre environnement de développement. Vous aurez besoin des éléments suivants :

- PHP 8.1
- Composer
- Node.js

Suivez ces étapes pour installer et exécuter le projet :

1. Téléchargez le projet (ou clonez-le en utilisant Git).

2. Copiez le fichier `.env.example` dans le même répertoire et renommez-le en `.env`. Ensuite, configurez les informations d'authentification de la base de données dans le fichier `.env` selon vos besoins.

3. Ouvrez un terminal et naviguez jusqu'au répertoire racine du projet.

4. Exécutez la commande suivante pour installer les dépendances PHP à l'aide de Composer :

   ```bash
   composer install
   ```

5. Générez la clé de chiffrement en exécutant la commande suivante :

   ```bash
   php artisan key:generate --ansi
   ```

6. Exécutez les migrations pour créer les tables de la base de données et utilisez l'option `--seed` pour peupler la base de données avec des données initiales :

   ```bash
   php artisan migrate --seed
   ```

7. Démarrez le serveur local en exécutant la commande suivante :

   ```bash
   php artisan serve
   ```

8. Ouvrez un nouveau terminal et naviguez jusqu'au répertoire React du projet.

9. Copiez le fichier `react/.env.example` dans le même répertoire et renommez-le en `.env`. Modifiez le paramètre `VITE_API_BASE_URL` dans le fichier `.env` pour correspondre à l'URL de l'API Laravel.

10. Installez les dépendances Node.js en exécutant la commande suivante dans le répertoire React :

    ```bash
    npm install
    ```

11. Démarrez le serveur de développement Vite pour React avec la commande suivante :

    ```bash
    npm run dev
    ```
