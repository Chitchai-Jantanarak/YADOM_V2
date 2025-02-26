import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis'

import NavBar from '../components/layout/NavBar';
import NavBar2 from '../components/layout/NavBar2';
import Footer from '../components/layout/Footer';
import TextCarousel from '../components/ui/TextCarousel';
import Underline from '../components/ui/Underline.jsx';

import Login from './Login';
import PasswordForgot from './PasswordForgot.jsx';
import Starter from './Starter.jsx'
import AdvancedApp from '../components/experience/__test_v2.jsx';

export default function Home() {
    
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
    

    return (
        <>  
            <div className='Home mx-[5%]'>
                <div>
                    <NavBar2 />
                    <br />
                    <Underline />
                </div>

                <section className='expereince-home-sticky-section'>
                    <AdvancedApp />
                    <p>END SECTION</p>
                </section>
                <section className='h-lvh'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem architecto rerum delectus non quisquam ipsa, laborum id omnis quasi quibusdam eveniet? Ab quia illo veritatis ullam asperiores neque consequatur quos ut veniam sed ratione debitis, quis doloremque ducimus voluptatibus unde aut dolore praesentium cum laudantium eligendi dolorem a perferendis? Nemo quae rem corporis earum eum autem sapiente aut quo in, veritatis ipsam nobis doloremque nostrum magni culpa hic non corrupti nam vitae quis. Expedita aliquam laborum assumenda provident ea possimus minus iusto magnam nisi sunt ut, nulla reprehenderit commodi laboriosam! A qui nam consequatur obcaecati eos soluta animi unde molestias repellendus porro ullam vitae ratione distinctio nihil labore, accusamus perferendis excepturi asperiores ipsam est nisi nesciunt. Odio magni reprehenderit necessitatibus, iusto qui itaque fugit facere harum quis, consequuntur ea! Id itaque, labore odio voluptatibus debitis sit quisquam voluptates praesentium officiis minima cupiditate consequuntur modi quod repellat earum aut? Nam similique quae molestias perspiciatis ab dolorem, expedita aliquam repellendus quasi aspernatur culpa, quia alias officiis laborum! Quos veniam cumque asperiores maxime. Accusamus voluptates voluptate et asperiores ipsam, quibusdam dolorem! Ex eaque tenetur officia, quas veritatis laudantium nam molestiae praesentium, in consectetur iusto fugiat possimus unde eum distinctio quasi ducimus vitae dignissimos ullam necessitatibus non, blanditiis ipsa est quidem! Velit doloremque vero eius aspernatur ipsa, quibusdam enim consequatur odit autem accusantium tempore laborum placeat quisquam odio inventore pariatur ratione saepe maiores consequuntur? Impedit quidem vero nobis quasi accusamus alias cumque explicabo ea, quibusdam doloribus tempora praesentium officia porro cupiditate excepturi, ipsam molestias, ut maxime. Modi, aliquam. Eos recusandae quae rem aliquam, laudantium exercitationem molestiae ducimus nobis doloremque consequatur ad at accusamus vel quos dolorem unde error quasi temporibus, ratione ex qui perspiciatis. Quas asperiores dicta voluptas dolores suscipit distinctio debitis aliquid ipsam quae ex odio id perferendis, aut sit a ea minus in fugit voluptatem ratione similique! Ut, nesciunt laudantium aliquid quam possimus maiores aperiam magni aut dolor! Perferendis animi placeat fugit assumenda, odio adipisci necessitatibus aperiam esse, aliquid tenetur unde. Perferendis mollitia doloremque, dicta sapiente, quibusdam aliquam libero est minus debitis adipisci eveniet cum. Ratione qui officia minus debitis obcaecati dolor voluptates? Pariatur numquam nihil illum debitis obcaecati eveniet cupiditate voluptates praesentium voluptatibus magnam nulla delectus earum magni deserunt illo sint est maxime, exercitationem ducimus. Minima, mollitia voluptates. Rem accusamus rerum numquam facilis asperiores nisi dolorem corrupti, distinctio voluptates, suscipit quos quae. Molestias maiores et iusto modi eaque distinctio asperiores saepe voluptatibus a quod. Placeat ipsum dolor voluptates magni voluptatibus? Sint ex blanditiis tempore deleniti harum enim reprehenderit sed ab voluptas, obcaecati nesciunt quis officiis vel assumenda itaque eveniet illum quibusdam, architecto ducimus deserunt et quas at cupiditate odit. Fugit blanditiis ab amet molestiae voluptatibus aspernatur, perspiciatis magni voluptas omnis sint! Dignissimos odit laboriosam architecto perferendis nihil aliquam. Vero delectus omnis aliquam neque est quasi vel doloremque architecto officiis tempore molestias ipsam amet accusamus eos sed, sapiente labore ullam, odio dicta dolorem cumque voluptatum! Aliquam, hic aliquid debitis quod quae ducimus magnam, amet minus tempora qui animi, doloribus aperiam? Eum, a?</section>
                <TextCarousel 
                    text={[
                        'REFRESHING AROMAS',
                        'GET BOOSTED',
                        'DON’T FEEL BAD, FEEL THE STYLE'
                    ]}
                    colorIndex={[2, 1, 3]}
                    baseVelocity={5} 
                    className="font-anybody"
                />
                <TextCarousel 
                    text={[
                        'REFRESHING AROMAS',
                        'GET BOOSTED',
                        'DON’T FEEL BAD, FEEL THE STYLE'
                    ]}
                    colorIndex={[2, 1, 3]}
                    baseVelocity={-5} 
                    className="font-anybody"
                />
                <section className=' h-lvh'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum quasi at asperiores, sunt ducimus sint? Temporibus enim ab praesentium perspiciatis beatae officiis ratione nemo cumque fuga. Sed consectetur non repudiandae a voluptates harum, ipsam rem eum vel facilis ad ab dolorum amet aperiam possimus laboriosam eligendi voluptate ipsa sint ex dicta ducimus labore? Sapiente esse, consectetur blanditiis aspernatur deserunt, rem voluptates assumenda libero dicta beatae excepturi nemo cupiditate repudiandae asperiores dolorem quod inventore repellat tempore. Saepe numquam, vero ducimus voluptatibus non natus! Quibusdam dolore commodi rem dolorem culpa nostrum eum corrupti aliquid! Expedita, optio tempore? Ea corporis consequatur reprehenderit, perspiciatis mollitia odit adipisci necessitatibus, doloribus assumenda eos repudiandae reiciendis ullam porro suscipit dolore obcaecati fugiat dicta, eius ipsa eum. Debitis quas possimus saepe nobis quam perferendis numquam magnam quis esse tempora ea, eius tenetur? Impedit rerum hic non animi, ducimus quasi dolore blanditiis neque! Repellendus eveniet odit, facere eum saepe ab perspiciatis. Rem quibusdam esse eius autem. Doloremque facere deserunt sed quidem aspernatur quae est cupiditate ex quaerat numquam voluptatibus modi tenetur dolorum saepe, repellendus reiciendis totam autem commodi dicta quasi. Sit repudiandae quis nam molestias cumque numquam ducimus quibusdam inventore unde. A at est doloremque quos, non obcaecati reiciendis dignissimos adipisci numquam nisi minima, natus in. Suscipit quo at rerum recusandae! Consequatur et neque consectetur aliquam. Consequatur commodi ut inventore adipisci perferendis cumque quis assumenda possimus vitae nihil placeat, animi maxime tenetur iure porro debitis nam architecto esse perspiciatis? Dolore nam incidunt eius aperiam minima veritatis dolor, eos dolorem illo vel, quam sed quia temporibus magnam ducimus in ratione doloribus officiis consectetur quas. Facilis numquam hic reiciendis cum impedit quae aspernatur, qui quibusdam ex ea magni assumenda amet quisquam adipisci delectus inventore sapiente officia voluptatum consequuntur doloribus commodi perspiciatis tenetur? Quae, quos quod quis iste dolorum praesentium nostrum! Dolor corrupti, consequuntur aperiam nobis enim rem minus obcaecati quisquam optio est aut odit quibusdam quos tempora quaerat asperiores dicta, aliquid nisi. Ipsum reiciendis repudiandae veritatis veniam officia excepturi quae distinctio, dignissimos fugit, adipisci velit dolores illo ab tenetur quasi expedita! Laudantium, recusandae. Veritatis iste soluta reiciendis harum voluptate repellat, optio exercitationem est! Dicta excepturi voluptatum sequi iure ullam, officia culpa minima explicabo aspernatur voluptate voluptates odio dolores esse beatae. Pariatur facilis odio dolore cumque accusantium temporibus recusandae, eius obcaecati possimus labore? Veritatis assumenda delectus consequatur, esse animi laboriosam nemo id cumque consectetur vel, illum rerum sit deserunt magnam autem illo, vero praesentium sed? Nam ea ullam optio alias, fugit sunt non minus suscipit repudiandae nobis voluptate reiciendis nesciunt rerum tempore architecto nostrum quam excepturi. Fugiat, ratione adipisci saepe blanditiis nihil distinctio quibusdam officiis, optio incidunt illum assumenda quisquam dolores unde? Laboriosam doloribus perspiciatis laborum consectetur accusantium ullam voluptate vitae? Dolor sit quibusdam omnis quidem eos ullam earum repudiandae ut repellendus minus. Necessitatibus beatae rem incidunt repellat fuga fugit sapiente, numquam nesciunt accusamus cum ut quisquam. Reiciendis ab dicta consectetur mollitia necessitatibus porro inventore iure vitae, facere cum dolore? Quas debitis incidunt animi placeat, excepturi nam sapiente perferendis repellat neque sint.</section>
            </div>
            <Footer />
        </>
    );
}
