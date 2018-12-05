
/* LABELS ENTITY ************************************************/


DROP TABLE IF EXISTS labels;

CREATE TABLE labels (
  label_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  HQ_city VARCHAR(255) NOT NULL,
  PRIMARY KEY (label_id),
  KEY id (label_id)
) ENGINE=InnoDB;

INSERT INTO labels(name,HQ_city) VALUES ('Atlantic Records', 'New York City'),('EMI Columbia', 'United Kingdom'),('Elektra','St. Johns'),('Warner Brothers', 'Burbank'),('Vertigo', 'United Kingdom'),('ABC Records','New York City');

/* VENUES ENTITY ****************************************/

DROP TABLE IF EXISTS venues;

CREATE TABLE venues (
  venue_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  max_seating INT DEFAULT NULL,
  city VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (venue_id),
  KEY name (name)
) ENGINE=InnoDB;

INSERT INTO venues(name,max_seating,city) VALUES ('Royal Albert Hall',5272, 'London'),('Hyde Park',50000, 'London'),('Madison Square Garden',20789,'New York'),('The Spectrum',18000,'Philadelphia'),('Wembley Arena',12500,'Wembley'),('Greenwich',8000,'Greenwich');

/* BANDS ENTITY ************************************************/


DROP TABLE IF EXISTS bands;

CREATE TABLE bands (
  band_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  label INT NOT NULL,
  hometown VARCHAR(255) NOT NULL,
  PRIMARY KEY (band_id),
  FOREIGN KEY (label) REFERENCES labels (label_id)
) ENGINE=InnoDB;

INSERT INTO bands(name,label,hometown) VALUES ('Led Zeppelin',1,  'London'),('Pink Floyd',2, 'London'),('Phish',3,'Vermont'),('Grateful Dead',4,'San Francisco'),('Dire Straits',5,'Deptford'),('Steely Dan',6,'New York');

/* GUITAR PLAYERS ENTITY **************************************/

DROP TABLE IF EXISTS guitar_players;

CREATE TABLE guitar_players (
  player_id INT NOT NULL AUTO_INCREMENT,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  guitar_type VARCHAR(50) DEFAULT NULL,
  fav_venue INT DEFAULT NULL,
  PRIMARY KEY (player_id),
  FOREIGN KEY (fav_venue) REFERENCES venues (venue_id)
) ENGINE=InnoDB;

INSERT INTO guitar_players(fname,lname,guitar_type,fav_venue) VALUES ('Jimmy','Page','Les Paul',1),('David','Gilmour','Stratocaster',2),('Trey','Anastasio','Languedoc',3),('Jerry','Garcia','Tiger etc.', 4), ('Mark','Knopfler','Les Paul', 5), ('Walter','Becker','Becker', 6);



DROP TABLE IF EXISTS bands_players;
--MANY TO MANY SEPARATE TABLE
CREATE TABLE bands_players (
  band_id INT NOT NULL,
  player_id INT NOT NULL,
  FOREIGN KEY (band_id) REFERENCES bands(band_id),
  FOREIGN KEY (player_id) REFERENCES guitar_players(player_id),
  PRIMARY KEY (band_id,player_id)
)ENGINE=InnoDB;

INSERT INTO bands_players(band_id,player_id) VALUES (1,1),(2,2),(3,3),(4,4),(5,5),(6,6);
