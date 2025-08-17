insert into patients (hn, full_name, phone, dob)
values ('HN12345','นายเอ ใจดี','0800000001','1980-05-01') on conflict do nothing;

insert into patients (hn, full_name, phone, dob)
values ('HN22221','นางบี ใจงาม','0800000002','1985-06-02') on conflict do nothing;
