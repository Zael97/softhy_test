
-- Crear tabla grado
create table grado(
	nid_grado serial primary key,
	desc_grado varchar(30),
	nivel varchar(3),
	orden integer
);
-- Eliminar tabla grado
drop table grado;

--Crear tabla persona
create table persona(
	nid_persona serial primary key,
	nom_persona varchar(50),
	ape_pate_pers varchar(50),
	ape_mate_pers varchar(50),
	nid_grado integer,
	fecha_naci date,
	foto_ruta varchar(255),
	constraint fk_grado
	foreign key (nid_grado) 
	references grado(nid_grado) on delete cascade
);
-- Eliminar tabla persona
drop table persona;
--crear tabla movimiento
create table movimiento(
	id_movimiento serial primary key,
	tipo_movimiento varchar(20),
	monto numeric,
	estado varchar(20),
	fecha_pago timestamp,
	id_persona integer,
	id_detalle_cronograma integer,
	constraint fk_detalle_cronograma
	foreign key (id_detalle_cronograma )
	references detalle_cronograma(id_detalle_cronograma ) on delete cascade,
	constraint fk_persona
	foreign key (id_persona)
	references persona(nid_persona) on delete cascade
);
-- Eliminar tabla movimiento
drop table movimiento;
-- Crear tabla detalle_cronograma
create table detalle_cronograma(
	id_detalle_cronograma serial primary key,
	id_cronograma integer,
	desc_pension varchar(50),
	monto numeric,
	fecha_venci date,
	id_grado integer,
	constraint fk_cronograma
	foreign key (id_cronograma)
	references cronograma(id_cronograma) on delete cascade
);
-- Eliminar tabla detalle_cronograma
drop table detalle_cronograma;
-- Crear tabla cronograma
create table cronograma(
	id_cronograma serial primary key,
	year integer
);
-- Eliminar tabla cronograma
drop table cronograma;

-- insertar grados
insert into grado(desc_grado, nivel,orden) values ('2 años','INI',1),
												  ('3 años','INI',2),
												  ('4 años','INI',3),
												  ('5 años','INI',4),
												  ('Primero','PRI',5),
												  ('Segundo','PRI',6),
												  ('Tercero','PRI',7),
												  ('Cuarto','PRI',8),
												  ('Quinto','PRI',9),
												  ('Sexto','PRI',10),
												  ('Primero','SEC',11),
												  ('Segundo','SEC',12),
												  ('Tercero','SEC',13),
												  ('Cuarto','SEC',14),
												  ('Quinto','SEC',15);
												 
-- ver tabla grado
select * from grado;
--Obtener grados ordenas por el campo "orden"
SELECT concat(gra.desc_grado,' ',gra.nivel) AS nombre, gra.nid_grado AS orden FROM grado AS gra ORDER BY orden asc;

-- query que genera reporte
select 
concat(per.nom_persona,' ',per.ape_pate_pers,' ',per.ape_mate_pers) as Estudiante,
concat(gra.desc_grado,'-',gra.nivel ) as "Grado - nivel",
det.desc_pension as "Pensión",
mov.monto as "Monto",
det.fecha_venci as "Fecha vencimiento",
mov.fecha_pago as "Fecha de pago",
cro.year as "Año"
from persona as per 
	inner join grado as gra 
		on per.nid_grado = gra.nid_grado
	inner join movimiento as mov
		on per.nid_persona = mov.id_persona 
	inner join detalle_cronograma as det
		on mov.id_detalle_cronograma = det.id_detalle_cronograma
	inner join cronograma as cro
		on det.id_cronograma = cro.id_cronograma
	order by per.nom_persona asc, det.fecha_venci asc;
	
-- stored procedure/function
create or replace function registrar_estudiante(
	nom_persona varchar,
	ape_pate_pers varchar,
	ape_mate_pers varchar,
	nid_grado_val integer,
	fecha_naci date,
	foto_ruta varchar
)
returns integer
language plpgsql
as $BODY$
declare last_nid_persona integer;
declare monto integer;
declare nivel_var varchar;
declare last_id_detalle_cronograma integer;
declare compromiso varchar;
declare last_cronograma_id integer;
begin 
	insert into persona( nom_persona , ape_pate_pers, ape_mate_pers , nid_grado, fecha_naci , foto_ruta ) values (nom_persona , ape_pate_pers, ape_mate_pers , nid_grado_val, fecha_naci , foto_ruta) returning nid_persona into last_nid_persona;
	select nivel into nivel_var from grado where nid_grado = nid_grado;
	insert into cronograma(year) values((date_part('year', CURRENT_DATE))) returning id_cronograma into last_cronograma_id;
	case nivel_var 
		when 'INI' then
			monto := 300;
		when 'PRI' then
			monto := 450;
		when 'SEC' then
			monto := 540;
	end case;
	foreach compromiso in array array['matricula','marzo','abril','mayo','junio','julio','agosto','setiembre','octubre','noviembre','diciembre'] loop
		insert into detalle_cronograma(desc_pension, monto, id_cronograma ) values(compromiso, monto,last_cronograma_id) returning id_detalle_cronograma into last_id_detalle_cronograma;	
		insert into movimiento(monto,estado,id_persona,id_detalle_cronograma ) values(monto, 'POR PAGAR', last_nid_persona,last_id_detalle_cronograma );
	end loop;
	return last_nid_persona;
end $BODY$;
drop function registrar_estudiante;

-- Uso del store procedure/function
select registrar_estudiante('Diana', 'Luque', 'Pantoja', 12, '1995-11-06', 'default-avatar.png');

