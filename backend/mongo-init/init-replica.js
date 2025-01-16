try {
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "localhost:27017" }
      ]
    });
    print("Replica set initialized");
  } catch (error) {
    print("Error initializing replica set:", error);
  }