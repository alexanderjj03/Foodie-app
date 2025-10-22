ALTER TABLE Vote DROP CONSTRAINT fk_vote_reference_appuser;
ALTER TABLE Vote DROP CONSTRAINT fk_vote_reference_usercomment;
ALTER TABLE FoodLocation DROP CONSTRAINT fk_foodlocation_reference_summary;
ALTER TABLE UserComment DROP CONSTRAINT fk_usercomment_reference_appuser;
DROP TABLE ReviewsDish;
DROP TABLE LimitedTimeDish;
DROP TABLE Dish;
DROP TABLE Vote;
DROP TABLE Photo;
DROP TABLE Review;
DROP TABLE FoodLocationSummary;
DROP TABLE FoodLocation;
DROP TABLE UserComment;
DROP TABLE AppUser;

CREATE TABLE AppUser (
    UserID VARCHAR(36) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(20) NOT NULL,
    NumReviews INTEGER NOT NULL
);


CREATE TABLE UserComment (
    CommentID VARCHAR(36) PRIMARY KEY,
    Content VARCHAR(1000) NOT NULL,
    CommentTimestamp TIMESTAMP NOT NULL,
    ReviewID VARCHAR(36),
    ParentCommentID VARCHAR(36),
    UserID VARCHAR(36)  NOT NULL,
    CONSTRAINT fk_usercomment_reference_appuser FOREIGN KEY (UserID) REFERENCES AppUser ON DELETE CASCADE,
    CONSTRAINT fk_usercomment_parent FOREIGN KEY (ParentCommentID) REFERENCES UserComment(CommentID) ON DELETE CASCADE,
    CHECK (ReviewID IS NOT NULL OR ParentCommentID IS NOT NULL),
    CHECK (ReviewID IS NULL OR ParentCommentID IS NULL)
);

CREATE TABLE FoodLocation (
    FoodLocationName VARCHAR(50),
    Address VARCHAR(150),
    PostalCode VARCHAR(10),
    Country VARCHAR(50),
    TotalScore INTEGER NOT NULL,
    NumReviews INTEGER NOT NULL,
    City VARCHAR(100) NOT NULL,
    Genre VARCHAR(50) NOT NULL,
    FoodLocationSummaryID VARCHAR(36) UNIQUE,
    PRIMARY KEY (FoodLocationName, Address, PostalCode, Country)
);


CREATE TABLE FoodLocationSummary (
    SummaryID VARCHAR(36) PRIMARY KEY,
    AverageRating FLOAT NOT NULL,
    Description VARCHAR(255) NOT NULL,
    FoodLocationName VARCHAR(50) NOT NULL,
    Address VARCHAR(150) NOT NULL,
    PostalCode VARCHAR(10) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    CONSTRAINT fk_foodlocationsummary_reference_foodlocation FOREIGN KEY (FoodLocationName, Address, PostalCode, Country) REFERENCES FoodLocation (FoodLocationName, Address, PostalCode, Country) ON DELETE CASCADE
);

ALTER TABLE FoodLocation ADD CONSTRAINT fk_foodlocation_reference_summary FOREIGN KEY (FoodLocationSummaryID) REFERENCES FoodLocationSummary(SummaryID);


CREATE TABLE Review (
    ReviewID VARCHAR(36) PRIMARY KEY,
    OverallRating SMALLINT NOT NULL,
    ServiceRating SMALLINT NOT NULL,
    WaitTimeRating SMALLINT NOT NULL,
    ReviewTimeStamp TIMESTAMP NOT NULL,
    FoodLocationName VARCHAR(50) NOT NULL,
    Address VARCHAR(150) NOT NULL,
    PostalCode VARCHAR(10) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    UserID VARCHAR(36)  NOT NULL,
    CONSTRAINT fk_review_reference_user FOREIGN KEY (UserID) REFERENCES AppUser ON DELETE CASCADE,
    CONSTRAINT fk_review_reference_foodlocation FOREIGN KEY (FoodLocationName, Address, Country, PostalCode) REFERENCES FoodLocation (FoodLocationName, Address, Country, PostalCode) ON DELETE CASCADE
);

CREATE TABLE Photo (
    PhotoID VARCHAR(36) PRIMARY KEY,
    ImageURL VARCHAR(225) NOT NULL,
    Description VARCHAR(1000),
    PhotoTimestamp TIMESTAMP NOT NULL,
    ReviewID VARCHAR(36)  NOT NULL,
    SummaryID VARCHAR(36) ,
    CONSTRAINT fk_photo_reference_foodlocationsummary FOREIGN KEY (SummaryID) REFERENCES FoodLocationSummary ON DELETE CASCADE,
    CONSTRAINT fk_photo_reference_review FOREIGN KEY (ReviewID) REFERENCES Review ON DELETE CASCADE
);

CREATE TABLE Vote (
    VoteID VARCHAR(36) PRIMARY KEY,
    UserID VARCHAR(36)  NOT NULL,
    PhotoID VARCHAR(36),
    CommentID VARCHAR(36),
    CONSTRAINT fk_vote_reference_appuser FOREIGN KEY (UserID) REFERENCES APPUSER ON DELETE CASCADE,
    CONSTRAINT fk_vote_reference_usercomment FOREIGN KEY (CommentID) REFERENCES USERCOMMENT ON DELETE CASCADE,
    CONSTRAINT fk_vote_reference_photo FOREIGN KEY (PhotoID) REFERENCES PHOTO ON DELETE CASCADE,
    CHECK (PhotoID IS NOT NULL OR CommentID IS NOT NULL),
    CHECK (PhotoID IS NULL OR CommentID IS NULL)
);

CREATE TABLE Dish (
    DishName VARCHAR(50),
    Price FLOAT NOT NULL,
    Type VARCHAR(20) NOT NULL,
    isHalal NUMBER(1) NOT NULL,
    isGlutenFree NUMBER(1) NOT NULL,
    isVegetarian NUMBER(1) NOT NULL,
    FoodLocationName VARCHAR(50),
    Address VARCHAR(150),
    PostalCode VARCHAR(10),
    Country VARCHAR(50),
    CONSTRAINT check_booleans CHECK (isHalal IN (0, 1) AND isGlutenFree IN (0, 1) AND isVegetarian IN (0, 1)),
    CONSTRAINT fk_dish_reference_foodlocation FOREIGN KEY (FoodLocationName, Address, Country, PostalCode) REFERENCES FoodLocation (FoodLocationName, Address, Country, PostalCode) ON DELETE CASCADE,
    PRIMARY KEY (DishName, FoodLocationName, Address, Country, PostalCode)
);

CREATE TABLE LimitedTimeDish (
    DishName VARCHAR(50),
    FoodLocationName VARCHAR(50),
    Address VARCHAR(150),
    PostalCode VARCHAR(10),
    Country VARCHAR(50),
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    CONSTRAINT fk_limitedtimedish_reference_dish FOREIGN KEY (DishName, FoodLocationName, Address, PostalCode, Country) REFERENCES Dish (DishName, FoodLocationName, Address, PostalCode, Country),
    PRIMARY KEY (DishName, FoodLocationName, Address, PostalCode, Country)
);


CREATE TABLE ReviewsDish (
    ReviewID VARCHAR(36),
    DishName VARCHAR(50),
    DishRating SMALLINT NOT NULL,
    FoodLocationName VARCHAR(50),
    Address VARCHAR(150),
    PostalCode VARCHAR(10),
    Country VARCHAR(50),
    CONSTRAINT fk_reviewsdish_reference_review FOREIGN KEY (ReviewID) REFERENCES Review (ReviewID) ON DELETE CASCADE,
    CONSTRAINT fk_reviewsdish_reference_dish FOREIGN KEY (DishName, FoodLocationName, Address, PostalCode, Country) REFERENCES Dish (DishName, FoodLocationName, Address, PostalCode, Country) ON DELETE CASCADE,
    PRIMARY KEY (ReviewID, DishName, FoodLocationName, Address, PostalCode, Country)
);
INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('7309d25b-1e98-4a82-ba00-8b412b1c7e2e', 'Admin', 'Admin', 'admin@admin.com', 'admin', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('4d7577fc-636e-40b1-ab1f-f3c12422c84a', 'Sabrina', 'Woo', 'sabrinawoo3895@gmail.com', 'iloveicecream1', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('45483f02-a838-4ff1-839e-d9ab83f6f46c', 'Sabrina', 'Woo','wsabrina@telus.net', 'bob@!', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('5aba12e6-a3b0-4d19-a078-6f9f41a81eec', 'Jerry', 'Chiang','jerrychiang@gmail.com', 'jerryc', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('b6751637-b434-419e-ae0d-1a0c7c405053', 'Alex', 'Jacobson','alexjacob@gmail.com', 'alexjacob', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('88e5791d-0fd7-4721-b8f6-5aad4845f095', 'Bob', 'Smith','bobsmith@outlook.com', 'bob', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('fb6a2c9e-9e6b-4b83-8f5f-77c0d4990b9b', 'Emily', 'Davis', 'emily.davis1@gmail.com', 'emily123', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('1c62e735-5f83-4cd9-94b0-cb49cf4b92c3', 'Michael', 'Johnson', 'michael.j@live.com', 'mjohnson', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('2d769e38-3c29-45e2-b1a2-4d9d742c0c61', 'Sophia', 'Brown', 'sophiabrown@yahoo.com', 'sophia2024', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('e03771f2-8f6c-4e30-a37b-5d6c381f450e', 'Liam', 'Taylor', 'liamtaylor@mail.com', 'liamtaylor12', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('35f30e4a-25d2-43d4-a55c-fc9b5a30895c', 'Olivia', 'Wilson', 'olivia.w@gmail.com', 'olivia!23', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('8141ad7b-e670-44ff-bc3b-d9ea6de3eacf', 'Noah', 'Anderson', 'noah.a@outlook.com', 'andersonn', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('b6e2a413-df97-4bfb-9b88-e5a0d4345b43', 'Ava', 'Martinez', 'ava.martinez@protonmail.com', 'avamart', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('af943d85-91e5-4089-b20f-8923d4949b2d', 'James', 'Clark', 'jamesc@icloud.com', 'jamesC!', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('3c8b4731-3483-4a78-b63a-c5f72c8d51c2', 'Isabella', 'Hernandez', 'isabella.h@gmail.com', 'bella2023', 0);

INSERT INTO AppUser(UserID, FirstName, LastName, Email, Password, NumReviews)
VALUES ('92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245', 'Benjamin', 'White', 'benjamin.white@hotmail.com', 'benwhite', 0);

COMMIT;


INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID)
VALUES ('Sushi Mura', 9,4, '6485 Oak Street', 'Vancouver', 'V6M 2W7', 'Canada', 'Japanese', NULL);

INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID)
VALUES ('Published on Main', 4, 3, '3593 Main Street', 'Vancouver', 'V5V 3N4', 'Canada', 'Mediterranean', NULL);

INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID)
VALUES ('McDonald''s', 3, 2, '470 Yonge Street', 'Toronto', 'M4Y 1X5', 'Canada', 'American', NULL);

INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID)
VALUES ('Café de Flore', 5, 2, '172 Bd Saint-Germain', 'Paris', '75006', 'France', 'French', NULL);

INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID)
VALUES ('Miku Vancouver', 4, 3, '200 Granville Street 70', 'Vancouver', 'V6C 1S4', 'Canada', 'Japanese', NULL);

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country)
VALUES ('aa8e21cb-901b-4a8b-afcc-070a7ea2f749', 4.0, 'A popular spot for authentic Japanese sushi and friendly service.', 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country)
VALUES ('243037b2-1999-483c-aeeb-d640291b4b93', 4.3, 'Known for its Mediterranean-inspired dishes with a modern twist.', 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country)
VALUES ('38702090-77ff-4cfd-99e8-9f0d3b6fbef7', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country)
VALUES ('cea54cdc-68fc-42c8-8e37-03ae151b458c', 5.0, 'A historic café in the heart of Paris, serving traditional French cuisine.', 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country)
VALUES ('e2085150-c55c-4aea-a08f-b398c86eeb97', 3.7, 'A highly rated Japanese restaurant with exquisite flavors and vibrant atmosphere.', 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

UPDATE FoodLocation SET FoodLocationSummaryID = 'aa8e21cb-901b-4a8b-afcc-070a7ea2f749' WHERE FoodLocationName = 'Sushi Mura' AND Address = '6485 Oak Street' AND PostalCode = 'V6M 2W7' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = '243037b2-1999-483c-aeeb-d640291b4b93' WHERE FoodLocationName = 'Published on Main' AND Address = '3593 Main Street' AND PostalCode = 'V5V 3N4' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = '38702090-77ff-4cfd-99e8-9f0d3b6fbef7' WHERE FoodLocationName = 'McDonald''s' AND Address = '470 Yonge Street' AND PostalCode = 'M4Y 1X5' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = 'cea54cdc-68fc-42c8-8e37-03ae151b458c' WHERE FoodLocationName = 'Café de Flore' AND Address = '172 Bd Saint-Germain' AND PostalCode = '75006' AND COUNTRY = 'France';
UPDATE FoodLocation SET FoodLocationSummaryID = 'e2085150-c55c-4aea-a08f-b398c86eeb97' WHERE FoodLocationName = 'Miku Vancouver' AND Address = '200 Granville Street 70' AND PostalCode = 'V6C 1S4' AND COUNTRY = 'Canada';


INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '10 Dundas Street East', 'Toronto', 'M5B 2G9', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '250 Front Street West', 'Toronto', 'M5V 3G5', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '123 Queen Street West', 'Toronto', 'M5H 3M9', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '700 Bay Street', 'Toronto', 'M5G 1Z6', 'Canada', 'American', NULL);


INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '500 Robson Street', 'Vancouver', 'V6B 2B7', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '800 Granville Street', 'Vancouver', 'V6Z 1K3', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '1010 West Broadway', 'Vancouver', 'V6H 1E6', 'Canada', 'American', NULL);
INSERT INTO FoodLocation(FoodLocationName, TotalScore, NumReviews, Address, City, PostalCode, Country, Genre, FoodLocationSummaryID) VALUES ('McDonald''s', 0, 1, '1615 Davie Street', 'Vancouver', 'V6G 1W1', 'Canada', 'American', NULL);

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('ad7ac5ee-86ec-4705-9ec8-ac5797cd77ba', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '10 Dundas Street East', 'M5B 2G9', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('5c518297-ab52-48c0-9184-039710f1cb73', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '250 Front Street West', 'M5V 3G5', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('d6bb6b98-7ce7-477a-8720-b30c76e4691e', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '123 Queen Street West', 'M5H 3M9', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('851e4249-0928-469a-90df-8cf78d17d5eb', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '700 Bay Street', 'M5G 1Z6', 'Canada');

INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('6bfe58bb-5d0a-4a23-915c-7270c7072087', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '500 Robson Street',    'V6B 2B7', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('a394d26b-b2d9-4978-b3b8-ef8032061ed0', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '800 Granville Street', 'V6Z 1K3', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('e2e02310-85a3-44c5-b445-0f3843dbdfe1', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '1010 West Broadway',   'V6H 1E6', 'Canada');
INSERT INTO FoodLocationSummary (SummaryID, AverageRating, Description, FoodLocationName, Address, PostalCode, Country) VALUES ('27d0be50-bce1-420e-88d2-998d1c3d1112', 3.0, 'A fast-food staple offering classic American burgers and fries.', 'McDonald''s', '1615 Davie Street',    'V6G 1W1', 'Canada');

UPDATE FoodLocation SET FoodLocationSummaryID = 'ad7ac5ee-86ec-4705-9ec8-ac5797cd77ba' WHERE FoodLocationName = 'McDonald''s' AND Address = '10 Dundas Street East' AND PostalCode = 'M5B 2G9' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = '5c518297-ab52-48c0-9184-039710f1cb73' WHERE FoodLocationName = 'McDonald''s' AND Address = '250 Front Street West' AND PostalCode = 'M5V 3G5' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = 'd6bb6b98-7ce7-477a-8720-b30c76e4691e' WHERE FoodLocationName = 'McDonald''s' AND Address = '123 Queen Street West' AND PostalCode = 'M5H 3M9' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = '851e4249-0928-469a-90df-8cf78d17d5eb' WHERE FoodLocationName = 'McDonald''s' AND Address = '700 Bay Street' AND PostalCode = 'M5G 1Z6' AND COUNTRY = 'Canada';

UPDATE FoodLocation SET FoodLocationSummaryID = '6bfe58bb-5d0a-4a23-915c-7270c7072087' WHERE FoodLocationName = 'McDonald''s' AND Address = '500 Robson Street' AND PostalCode = 'V6B 2B7' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = 'a394d26b-b2d9-4978-b3b8-ef8032061ed0' WHERE FoodLocationName = 'McDonald''s' AND Address = '800 Granville Street' AND PostalCode = 'V6Z 1K3' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = 'e2e02310-85a3-44c5-b445-0f3843dbdfe1' WHERE FoodLocationName = 'McDonald''s' AND Address = '1010 West Broadway' AND PostalCode = 'V6H 1E6' AND COUNTRY = 'Canada';
UPDATE FoodLocation SET FoodLocationSummaryID = '27d0be50-bce1-420e-88d2-998d1c3d1112' WHERE FoodLocationName = 'McDonald''s' AND Address = '1615 Davie Street' AND PostalCode = 'V6G 1W1' AND COUNTRY = 'Canada';

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('b234168e-dfd6-4cb7-87b5-c713944c64a0', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '10 Dundas Street East', 'M5B 2G9', 'Canada', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('471fbe79-ee46-4d49-9b13-4da06c7180e2', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '250 Front Street West', 'M5V 3G5', 'Canada', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('745e3047-0384-4dac-97d8-e95ce5fa5e5d', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '123 Queen Street West', 'M5H 3M9', 'Canada', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('70eeb82f-d051-41cd-a2ad-f4e56e12f46c', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '700 Bay Street',        'M5G 1Z6', 'Canada', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('14dc92bd-882e-46da-b3d4-59d13e8e3d7b', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '10 Dundas Street East', 'M5B 2G9', 'Canada', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('a6587eae-107c-4508-babf-b4fe4312797b', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '250 Front Street West', 'M5V 3G5', 'Canada', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('751e61df-f561-49a7-87af-0145a228bd4c', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '123 Queen Street West', 'M5H 3M9', 'Canada', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('3ab9c463-edc8-4813-9e46-15ac7abd433d', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '700 Bay Street',        'M5G 1Z6', 'Canada', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('89eqb82f-d051-41cd-a2ad-f4e56e12f46c', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '700 Bay Street',        'M5G 1Z6', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('4584cf68-103b-48dc-8c94-000b8baeeb70', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '500 Robson Street',    'V6B 2B7', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('6da89bf0-47e1-4781-b07a-7c74fa534a31', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '800 Granville Street', 'V6Z 1K3', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('63451b7e-39d9-48f9-8d60-012ae7ee50f5', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '1010 West Broadway',   'V6H 1E6', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID) VALUES ('2c254761-5e4e-4507-845f-da97006674a7', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '1615 Davie Street',    'V6G 1W1', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');


INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Spicy Tuna Roll', 12.99, 'sushi', 1, 0, 0, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Tuna Sashimi 5pcs', 12.95, 'sushi', 1, 1, 0, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Salmon Sashimi 5pcs', 12.95, 'sushi', 1, 1, 0, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Tuna Sashimi 9pcs', 21.25, 'sushi', 1, 1, 0, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Salmon Sashimi 9pcs', 21.25, 'sushi', 1, 1, 0, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

COMMIT;

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Lamb Shank', 25.50, 'main course', 0, 1, 0, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Wagyu Beef Carpaccio', 33.00, 'main course', 1, 1, 0, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Roasted Farm Carrots', 25.00, 'main course', 1, 1, 1, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Roasted Sunchoke Ice Cream', 15.00, 'dessert', 0, 1, 0, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Dungeness Crab', 33.00, 'main course', 0, 1, 0, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');

COMMIT;

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Big Mac', 6.99, 'burger', 0, 0, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Baked Peach Pie', 2.99, 'dessert', 0, 0, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('S''mores McFlurry', 2.50, 'dessert', 0, 1, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('World Famous Fries', 1.99, 'fries', 0, 0, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Coca-Cola', 1.50, 'drink', 0, 1, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

COMMIT;

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Croque Monsieur', 10.50, 'sandwich', 0, 0, 0, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Vegetarian Salad', 20.00, 'salad', 1, 1, 1, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Flavored Milk', 4.80, 'drink', 0, 1, 1, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Butter brioche or Raisin bread or Chocolate bread', 4.00, 'breakfast', 0, 1, 0, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('White Tuna Belly Fillet and Tomatoes', 20.00, 'snack', 1, 1, 0, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

COMMIT;

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Aburi Salmon Oshi', 16.00, 'sushi', 0, 1, 0, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Minato Platter', 160.00, 'sushi', 0, 1, 0, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Kyoto Saikyo Miso Sablefish', 48.00, 'sushi', 0, 1, 0, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Wagyu Steak 5oz', 160.00, 'steak', 1, 1, 0, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Wagyu Steak 10oz', 320.00, 'steak', 1, 1, 0, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

COMMIT;

INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Shaka Shaka Fries', 2.99, 'fries', 0, 0, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');
INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Teritama Burger', 6.99, 'burger', 0, 0, 0, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');
INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Chocobanana McFlurry', 6.99, 'dessert', 0, 1, 1, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');
INSERT INTO Dish (DishName, Price, Type, isHalal, isGlutenFree, isVegetarian, FoodLocationName, Address, PostalCode, Country)
VALUES ('Edamame and Corn', 6.99, 'burger', 1, 1, 1, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO LIMITEDTIMEDISH (DishName, FoodLocationName, Address, PostalCode, Country, StartDate, EndDate)
VALUES ('Shaka Shaka Fries','McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '2024-10-01 12:30:00', '2025-01-01 00:00:00');
INSERT INTO LIMITEDTIMEDISH (DishName, FoodLocationName, Address, PostalCode, Country, StartDate, EndDate)
VALUES ('Teritama Burger','McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '2024-11-05 12:30:00', '2024-12-20 00:00:00');
INSERT INTO LIMITEDTIMEDISH (DishName, FoodLocationName, Address, PostalCode, Country, StartDate, EndDate)
VALUES ('Chocobanana McFlurry','McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '2024-10-01 12:30:00', '2025-03-05 12:30:00');
INSERT INTO LIMITEDTIMEDISH (DishName, FoodLocationName, Address, PostalCode, Country, StartDate, EndDate)
VALUES ('Edamame and Corn','McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '2024-11-01 12:30:00', '2024-12-06 15:30:00');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', 5, 4, 3, '2024-10-01 12:30:00', 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('b1f1c5b9-79fb-4a6d-9a58-9b953a114481', 4, 4, 3, '2024-10-01 12:31:00', 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada', 'fb6a2c9e-9e6b-4b83-8f5f-77c0d4990b9b');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('d6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', 4, 5, 4, '2024-09-28 19:45:00', 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada', 'b6751637-b434-419e-ae0d-1a0c7c405053');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('f01f6e3e-a768-4e3e-924b-7c92983f089a', 3, 3, 2, '2024-09-25 10:00:00', 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('e70b45f1-5b25-4df7-82c3-b24bafedf2c1', 5, 5, 5, '2024-10-05 16:15:00', 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France', 'b6751637-b434-419e-ae0d-1a0c7c405053');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('12b671b9-3826-46ba-a9d2-dc5a2f74ad64', 4, 4, 3, '2024-09-30 14:00:00', 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada', '88e5791d-0fd7-4721-b8f6-5aad4845f095');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('d43e0f79-e09f-4bc3-ad48-c5ecead2870a', 3, 4, 3, '2024-10-21 15:30:00', 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

--
INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('f12a48b5-3cb0-44cd-9eb9-a604ac8b8d2a', 4, 4, 5, '2024-10-02 13:45:00', 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada', '1c62e735-5f83-4cd9-94b0-cb49cf4b92c3');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('c9a4d12f-8749-442e-a5d8-0a39648e0b1d', 5, 5, 4, '2024-10-07 18:15:00', 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada', 'b6e2a413-df97-4bfb-9b88-e5a0d4345b43');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('a8b40e93-3241-476f-809e-0e6f859e3d5b', 3, 3, 2, '2024-09-24 11:20:00', 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('d0c54f1b-7db8-495e-9fb8-60f09a16c6de', 5, 5, 5, '2024-10-14 19:00:00', 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France', '8141ad7b-e670-44ff-bc3b-d9ea6de3eacf');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('35f0cd78-941c-4d29-806b-00a41247b328', 4, 4, 3, '2024-09-30 14:30:00', 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada', 'af943d85-91e5-4089-b20f-8923d4949b2d');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('e20123dc-b70c-4fa8-b27b-604e3f2c7498', 3, 3, 4, '2024-10-20 10:15:00', 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada', '3c8b4731-3483-4a78-b63a-c5f72c8d51c2');

INSERT INTO Review (ReviewID, OverallRating, ServiceRating, WaitTimeRating, ReviewTimestamp, FoodLocationName, Address, PostalCode, Country, UserID)
VALUES ('98c2a1f3-b1d4-4a61-83b9-7699e3b43af5', 4, 4, 3, '2024-09-25 16:00:00', 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada', '45483f02-a838-4ff1-839e-d9ab83f6f46c');


COMMIT;

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3','It was a great experience.', '2024-10-13 14:23:00', '5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', NULL, '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('df8475e2-2e64-4a62-bbd1-c1d5d174d9f7', 'Can you clarify what you mean by this?', '2024-10-13 14:45:00', NULL, '27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('c6dc8a9f-5a28-43fd-be68-49aa9b22e684', 'no + ratio', '2024-10-13 14:46:00', NULL, 'df8475e2-2e64-4a62-bbd1-c1d5d174d9f7', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('4cbe489b-6748-41a4-8a5e-7e5d5b924bfb', 'This comment thread has been really informative, thanks!', '2024-10-13 14:55:00', NULL, 'c6dc8a9f-5a28-43fd-be68-49aa9b22e684', 'b6751637-b434-419e-ae0d-1a0c7c405053');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('ac8b1f75-4321-45a3-9783-6d89ab23c0b1', 'I paid so much for some doodoo donkey food.', '2024-10-13 14:40:00', 'd6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', NULL, 'b6751637-b434-419e-ae0d-1a0c7c405053');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('fe8b3e22-fc7d-4a1e-b36a-b7e2487c3c75', 'It was okay. Not great, not terrible.', '2024-10-13 14:50:00', 'dbff5e43-67b4-44e2-b78d-5331a3c33fa5', NULL, '88e5791d-0fd7-4721-b8f6-5aad4845f095');



INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('27b2d51f-4b98-6c20-a631-f3a6b6f1f5b3','I asked the server for her number and she underwent metamorphosis.', '2024-10-20 10:17:00', 'e20123dc-b70c-4fa8-b27b-604e3f2c7498', NULL, '3c8b4731-3483-4a78-b63a-c5f72c8d51c2');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('ac2325e2-2e64-4a62-bbd1-c1d5d174d9f7', 'HUH????????', '2024-10-20 11:17:00', NULL, '27b2d51f-4b98-6c20-a631-f3a6b6f1f5b3', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('c6a88a9f-5a28-1531-be68-4954ab39a484', 'Tell us more? What was okay? What was bad? Whats the meaning of life?', '2024-10-13 16:46:00', NULL, 'fe8b3e22-fc7d-4a1e-b36a-b7e2487c3c75', '4d7577fc-636e-40b1-ab1f-f3c12422c84a');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('4ae8489b-3462-41a4-4b2e-7e5d5b924bfb', 'I like turtles', '2024-09-25 16:00:05', '98c2a1f3-b1d4-4a61-83b9-7699e3b43af5', NULL, '45483f02-a838-4ff1-839e-d9ab83f6f46c');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('ac8b2075-3532-45a3-9783-6d892c23c0b1', 'Agreed, theyre delicious.', '2024-09-25 16:25:31', NULL, '4ae8489b-3462-41a4-4b2e-7e5d5b924bfb', 'b6751637-b434-419e-ae0d-1a0c7c405053');

INSERT INTO UserComment (CommentID, Content, CommentTimestamp, ReviewID, ParentCommentID, UserID)
VALUES ('67483e22-fc7d-4a1e-b36a-b7e6c78c3c75', 'What does it taste more like? Doodoo or donkey?', '2024-10-13 14:50:00', NULL, 'ac8b1f75-4321-45a3-9783-6d89ab23c0b1', '45483f02-a838-4ff1-839e-d9ab83f6f46c');


COMMIT;

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', 'Spicy Tuna Roll', 5, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', 'Tuna Sashimi 5pcs', 8, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('b1f1c5b9-79fb-4a6d-9a58-9b953a114481', 'Spicy Tuna Roll', 7, 'Sushi Mura', '6485 Oak Street', 'V6M 2W7', 'Canada');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', 'Lamb Shank', 4, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');
INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', 'Wagyu Beef Carpaccio', 5, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');
INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', 'Roasted Sunchoke Ice Cream', 5, 'Published on Main', '3593 Main Street', 'V5V 3N4', 'Canada');


INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('f01f6e3e-a768-4e3e-924b-7c92983f089a', 'Big Mac', 3, 'McDonald''s', '470 Yonge Street', 'M4Y 1X5', 'Canada');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('e70b45f1-5b25-4df7-82c3-b24bafedf2c1', 'Croque Monsieur', 5, 'Café de Flore', '172 Bd Saint-Germain', '75006', 'France');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('12b671b9-3826-46ba-a9d2-dc5a2f74ad64', 'Aburi Salmon Oshi', 4, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d43e0f79-e09f-4bc3-ad48-c5ecead2870a', 'Aburi Salmon Oshi', 4, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');
INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d43e0f79-e09f-4bc3-ad48-c5ecead2870a', 'Minato Platter', 5, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');
INSERT INTO ReviewsDish (ReviewID, DishName, DishRating, FOODLOCATIONNAME, ADDRESS, POSTALCODE, COUNTRY)
VALUES ('d43e0f79-e09f-4bc3-ad48-c5ecead2870a', 'Wagyu Steak 5oz', 3, 'Miku Vancouver', '200 Granville Street 70', 'V6C 1S4', 'Canada');

COMMIT;

INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', 'https://sushi-mura.com/wp-content/uploads/2022/05/Dinner-For-Two-300x300.jpg' , 'Deluxe sushi platter.', '2024-10-13 14:30:00', '5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', 'aa8e21cb-901b-4a8b-afcc-070a7ea2f749');
INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('a706202e-2cdd-45fe-9241-6a64834dfa2c', 'https://sushi-mura.com/wp-content/uploads/2023/02/location_oak15.jpg' , 'Restaurant exterior.', '2024-10-13 14:10:00', '5b3c2a1d-d5c4-4e9e-80cd-3e5d232df9f1', 'aa8e21cb-901b-4a8b-afcc-070a7ea2f749');


INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('d5e79861-4d1f-4a94-bb15-b7b75c8f8e54', 'https://www.mychals.org/wp-content/uploads/2024/01/Mychals-Cafe-2-300x300.jpg' ,'Cozy and inviting ambience of the cafe.', '2024-10-13 14:35:00', 'd6b9c3e1-893b-4d6c-b39a-24dbb7a0289d', '243037b2-1999-483c-aeeb-d640291b4b93');

INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('f47e1c76-8b9e-4a77-89d3-2a4fb7c8e0c9', 'https://theeburgerdude.com/wp-content/uploads/2021/01/Big-Mac-1024x1024.jpg' ,'Delicious classic Big Mac.', '2024-10-13 14:40:00', 'f01f6e3e-a768-4e3e-924b-7c92983f089a', '38702090-77ff-4cfd-99e8-9f0d3b6fbef7');

INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('68e61d74-7f23-45ba-a71e-13f9b8d4c6f2', 'https://media-cdn.tripadvisor.com/media/photo-s/05/13/6f/da/cafe-de-flore.jpg' , 'Close-up shot of the main dish, looks delicious.', '2024-10-13 14:45:00', 'e70b45f1-5b25-4df7-82c3-b24bafedf2c1', 'cea54cdc-68fc-42c8-8e37-03ae151b458c');

INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('0d4312f3-3f1b-4c9b-89f3-d7e9d7c8f1e2', 'https://images.otstatic.com/prod1/31847079/1/huge.jpg' , 'Nice outdoor seating area with a view.', '2024-10-13 14:50:00', '12b671b9-3826-46ba-a9d2-dc5a2f74ad64', 'e2085150-c55c-4aea-a08f-b398c86eeb97');

INSERT INTO Photo (PhotoID, ImageURL, Description, PhotoTimestamp, ReviewID, SummaryID) VALUES ('351b0d95-8ba7-4322-8d78-55c34de6fcdf', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/300px-Sushi_platter.jpg' , 'Sushi platter!', '2024-10-21 15:50:00', 'd43e0f79-e09f-4bc3-ad48-c5ecead2870a', 'e2085150-c55c-4aea-a08f-b398c86eeb97');

COMMIT;

INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('550e8400-e29b-41d4-a716-446655440000', '5aba12e6-a3b0-4d19-a078-6f9f41a81eec', NULL,'27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('3e9b07de-b29a-43e7-9d22-1c90d1c0beef', 'b6751637-b434-419e-ae0d-1a0c7c405053', NULL,'27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('c70d12f0-5c0f-4fcb-93a9-1a0b93a7d5b1', '88e5791d-0fd7-4721-b8f6-5aad4845f095', NULL,'27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('6e1481a6-71f1-47e8-b8ec-9f788bfcf7fb', 'fb6a2c9e-9e6b-4b83-8f5f-77c0d4990b9b', NULL,'27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('803f4b93-b2b6-40d7-bb3d-5f98d05476a9', '1c62e735-5f83-4cd9-94b0-cb49cf4b92c3', NULL,'27a7d50f-4b98-4f20-a631-f3a6b6f1f5b3');

INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('af7633d6-5003-4c84-94f3-90a21ca0c50b', '4d7577fc-636e-40b1-ab1f-f3c12422c84a', NULL,'df8475e2-2e64-4a62-bbd1-c1d5d174d9f7');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('01602621-4c54-411d-9f2b-f351270e3142', 'b6751637-b434-419e-ae0d-1a0c7c405053', NULL,'df8475e2-2e64-4a62-bbd1-c1d5d174d9f7');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('7992a70e-4b0a-4348-a39e-f10133ba63a2', '88e5791d-0fd7-4721-b8f6-5aad4845f095', NULL,'df8475e2-2e64-4a62-bbd1-c1d5d174d9f7');

INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('82894643-07fc-4d81-a9b3-b399198d29d3', '35f30e4a-25d2-43d4-a55c-fc9b5a30895c', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('b4020886-1d28-4bae-95c8-94d9580d4f17', '8141ad7b-e670-44ff-bc3b-d9ea6de3eacf', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('ef3466ed-0c22-460f-85ec-e27fab1b3c3b', 'b6e2a413-df97-4bfb-9b88-e5a0d4345b43', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('cb1cadc3-877e-47db-8bb7-30c9fe2cf2f3', 'af943d85-91e5-4089-b20f-8923d4949b2d', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('f0c91cc6-6737-49e3-875d-bad2b400b33a', '3c8b4731-3483-4a78-b63a-c5f72c8d51c2', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('fc944569-fc0d-4dc3-af7f-de277b0b944c', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245', NULL,'c6dc8a9f-5a28-43fd-be68-49aa9b22e684');

INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('fdc08edf-aee1-4d1c-9c31-6993a69e7ebb', '35f30e4a-25d2-43d4-a55c-fc9b5a30895c', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('3d76e1c2-7f5c-4b87-9ce9-66ed1a84a555', '8141ad7b-e670-44ff-bc3b-d9ea6de3eacf', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('484eba5a-8e97-43f4-b2aa-573c78a87dad', 'b6e2a413-df97-4bfb-9b88-e5a0d4345b43', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('1a6dafd5-d321-4380-b597-3f7e500826c2', 'af943d85-91e5-4089-b20f-8923d4949b2d', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('a21e3e0b-e3df-4316-a00e-4d1e03485feb', '3c8b4731-3483-4a78-b63a-c5f72c8d51c2', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);
INSERT INTO Vote (VoteID, UserID, PhotoID, CommentID) VALUES ('c9fcd7ed-95ed-47e5-94d4-110fb3c6f5b1', '92ad6d5e-b2ab-4e19-9099-bc6fb6f8c245', 'a23d5e01-9c8f-4d5c-87a9-3a27b6c8a7ab', NULL);


COMMIT;