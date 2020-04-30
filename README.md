### Interstellar Transport System

    The solution has been implemented in Firebase, Angular and TypeScript.

    To see the app, go to the following link:
        https://interstellar-transport-system.firebaseapp.com

    The GitHub respository may be found at:
        https://github.com/kaylemaclou/interstellar-transport-system

#### 1. Persist the Graph into an in-memory database

    The data for Planets, Routes and Traffic Delays are stored in documents
    within the Firestore NoSql database.

#### 2. Read the file and import it into the DB

    When the CSV files containing data for Planets, Routes and Traffic Delays
    are uploaded to Firebase bucket storage, they trigger an event that imports
    them into their corresponding documents within the Firestore NoSql database

#### 3. Expose the database using a RESTful Webservice

    Firestore provides implicit REST endpoints for CRUD operations on documents
    (collections) stored within its database. For example, the Angular front-
    end application calls the default HTTP GET endpoint on the “Planets”
    collection and then uses the data to populate dropdown-boxes on the user-
    interface. Here is the URI:
    https://firestore.googleapis.com/v1/projects/interstellar-transport-system/databases/(default)/documents/planets

    For more information on the built-in Firestore endpoints, refer to the documentation found at the following link:
    	https://firebase.google.com/docs/firestore/use-rest-api

#### 4. Implement the algorithm

    The algorithm and data model are implemented within a Firebase Functions.
    The shortest path is obtained via a recursive implementation of Dijkstra’s algorithm.

#### 5. Expose the algorithm using a Document Literal Web service

    An endpoint providing the shortest path between two planets, has been exposed
    from via a Firebase Functions, using an HTTP GET REST endpoint. Here is
    the URI of the endpoint that is used to obtain the shortest path between
    planet "A" and planet "B":
    https://us-central1-interstellar-transport-system.cloudfunctions.net/getShortestPath?from-planet=A&to-planet=B

#### 6. Create a front end to capture the source and destination and then print the shortest path

    The front-end is implemented in Angular and has been uploaded to Firebase
    hosting, at the following link:
    	https://interstellar-transport-system.firebaseapp.com
